import os
import sys

# Add parent directory to path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal, engine
from app.models.base import Base
from app.models.asset import Asset
from app.models.user import User
from app.models.transaction import Transaction
from app.core.security import get_password_hash
import random

def generate_mock_data():
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Create Assets
    assets = [
        Asset(symbol="VTI", name="Vanguard Total Stock Market", asset_type="ETF", risk_level="Moderate", expected_returns=7.5),
        Asset(symbol="BND", name="Vanguard Total Bond Market", asset_type="ETF", risk_level="Conservative", expected_returns=3.5),
        Asset(symbol="BTC", name="Bitcoin", asset_type="Crypto", risk_level="Aggressive", expected_returns=15.0),
        Asset(symbol="AAPL", name="Apple Inc.", asset_type="Stocks", risk_level="Moderate", expected_returns=10.0),
        Asset(symbol="TSLA", name="Tesla Inc.", asset_type="Stocks", risk_level="Aggressive", expected_returns=12.0)
    ]
    
    for asset in assets:
        existing = db.query(Asset).filter(Asset.symbol == asset.symbol).first()
        if not existing:
            db.add(asset)
            
    # Create a test user
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            email="test@example.com",
            hashed_password=get_password_hash("password123"),
            income_range="50k-100k",
            risk_category="Moderate",
            wallet_balance=100.0
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        # Generate transactions
        categories = ["Food", "Transport", "Entertainment", "Utilities"]
        for _ in range(20):
            # Scale amount by ~80x for realistic INR values
            amt = round(random.uniform(50.0, 5000.0), 2)
            
            import math
            # Round off to nearest 10 or 100 INR depending on scale
            if amt > 1000:
                next_val = math.ceil(amt / 100.0) * 100
            else:
                next_val = math.ceil(amt / 10.0) * 10
                
            round_off = round(next_val - amt, 2)
            if round_off == 0:
                round_off = 10.0 if amt <= 1000 else 100.0
                
            tx = Transaction(
                user_id=test_user.id,
                amount=amt,
                category=random.choice(categories),
                round_off_amount=round_off,
                is_invested=False
            )
            db.add(tx)
            
    db.commit()
    db.close()
    print("Mock data generated successfully.")

if __name__ == "__main__":
    generate_mock_data()
