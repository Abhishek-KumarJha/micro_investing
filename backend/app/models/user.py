from sqlalchemy import Column, Integer, String, Float, Boolean, JSON
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Financial info
    income_range = Column(String, nullable=True) # e.g., "0-20k", "20k-50k"
    risk_score = Column(Float, nullable=True) # Calculated by ML
    risk_category = Column(String, nullable=True) # Conservative, Moderate, Aggressive
    
    # Behavioral features extracted from transactions
    behavioral_features = Column(JSON, nullable=True) # e.g., {"savings_consistency": 0.8, "spending_freq": 1.2}
    
    # Wallet / Simulated Balance
    wallet_balance = Column(Float, default=0.0)
