from sqlalchemy import Column, Integer, String, Float, JSON
from app.models.base import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True)
    name = Column(String)
    asset_type = Column(String) # Stocks, ETFs, Crypto
    risk_level = Column(String) # Conservative, Moderate, Aggressive
    expected_returns = Column(Float)
    features = Column(JSON, nullable=True) # Used for DLHR Content-based filtering
