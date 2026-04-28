import json
import os
from google import genai
from app.core.config import settings

def recommend_assets(user, all_assets):
    """
    Generate recommendations for a given user using Gemini API.
    """
    if not settings.GEMINI_API_KEY:
        # Fallback if no key is provided
        recommended = []
        user_risk = user.risk_category or "Moderate"
        for asset in all_assets:
            if asset.risk_level == user_risk:
                recommended.append(asset)
        if len(recommended) < 3:
            for asset in all_assets:
                if asset not in recommended:
                    recommended.append(asset)
        return recommended[:5]

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    # Prepare prompt
    asset_descriptions = "\n".join([f"- {a.symbol}: {a.name} ({a.asset_type}), Risk: {a.risk_level}, Expected Return: {a.expected_returns}%" for a in all_assets])
    
    prompt = f"""
You are an expert AI financial advisor. 
I have a user with the following profile:
- Income Range: {user.income_range}
- Risk Category: {user.risk_category or "Moderate"}

I have the following available assets:
{asset_descriptions}

Based on the user's risk profile, select the top 2-5 most suitable assets from the list above.
Return ONLY a JSON list of the symbols you recommend.
Example: ["VTI", "AAPL"]
"""
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        # Parse JSON
        text = response.text.strip()
        if text.startswith("```json"): text = text[7:]
        if text.startswith("```"): text = text[3:]
        if text.endswith("```"): text = text[:-3]
        symbols = json.loads(text.strip())
        
        recommended = [a for a in all_assets if a.symbol in symbols]
        if not recommended:
            return all_assets[:3]
        return recommended
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return all_assets[:3]

