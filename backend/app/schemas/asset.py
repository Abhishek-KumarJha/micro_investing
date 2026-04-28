from pydantic import BaseModel
from typing import Optional, Dict, Any

class AssetBase(BaseModel):
    symbol: str
    name: str
    asset_type: str
    risk_level: str
    expected_returns: float
    features: Optional[Dict[str, Any]] = None

class AssetSchema(AssetBase):
    id: int

    class Config:
        from_attributes = True
