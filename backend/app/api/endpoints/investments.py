from typing import Any, List
import pandas as pd
import io
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.asset import Asset
from app.schemas.asset import AssetSchema
from app.ml.dlhr_model import recommend_assets
from google import genai
import json
from app.core.config import settings

router = APIRouter()

@router.get("/recommendations", response_model=List[AssetSchema])
def get_recommendations(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get personalized investment recommendations using DLHR model.
    """
    assets = db.query(Asset).all()
    recommended_assets = recommend_assets(current_user, assets)
    return recommended_assets

@router.post("/upload-predict", response_model=List[AssetSchema])
async def upload_predict(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Upload a CSV file containing transactions to get instant AI recommendations
    AND import the transactions into the user's account for simulation.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
        df.columns = df.columns.str.strip().str.lower()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV: {e}")
        
    if 'amount' not in df.columns or 'category' not in df.columns:
        raise HTTPException(status_code=400, detail="CSV must contain 'amount' and 'category' columns (case-insensitive)")
        
    import math
    from app.models.transaction import Transaction
    
    # Import transactions to DB for simulation
    for _, row in df.iterrows():
        try:
            amt = float(row['amount'])
            
            # Round off to nearest 10 or 100 INR depending on scale
            if amt > 1000:
                next_val = math.ceil(amt / 100.0) * 100
            else:
                next_val = math.ceil(amt / 10.0) * 10
                
            round_off = round(next_val - amt, 2)
            if round_off == 0:
                round_off = 10.0 if amt <= 1000 else 100.0
                
            tx = Transaction(
                user_id=current_user.id,
                amount=amt,
                category=str(row['category']),
                round_off_amount=round_off,
                is_invested=False
            )
            db.add(tx)
        except Exception:
            continue
    db.commit()

    # Simple feature extraction
    total_spent = df['amount'].sum()
    top_categories = df['category'].value_counts().head(3).index.tolist()
    avg_txn = df['amount'].mean()
    
    # Infer risk from data
    inferred_risk = "Moderate"
    if avg_txn > 100:
        inferred_risk = "Aggressive"
    elif avg_txn < 20:
        inferred_risk = "Conservative"
        
    assets = db.query(Asset).all()
    
    # Call Gemini directly
    if not settings.GEMINI_API_KEY:
        return assets[:3]
        
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    asset_descriptions = "\n".join([f"- {a.symbol}: {a.name} ({a.asset_type}), Risk: {a.risk_level}" for a in assets])
    
    prompt = f"""
You are an expert AI financial advisor. 
I have analyzed a user's transaction history from an uploaded CSV:
- Total Spent: ₹{total_spent:.2f}
- Average Transaction: ₹{avg_txn:.2f}
- Top Spending Categories: {', '.join(top_categories)}
- Inferred Risk Profile: {inferred_risk}

Available assets:
{asset_descriptions}

Based on this behavioral data, select the top 2-5 most suitable assets.
Return ONLY a JSON list of the symbols. Example: ["VTI", "AAPL"]
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith("```json"): text = text[7:]
        if text.startswith("```"): text = text[3:]
        if text.endswith("```"): text = text[:-3]
        symbols = json.loads(text.strip())
        matched_assets = [a for a in assets if a.symbol in symbols]
        if not matched_assets:
            return assets[:3]
        return matched_assets
    except Exception as e:
        print(e)
        return assets[:3]

