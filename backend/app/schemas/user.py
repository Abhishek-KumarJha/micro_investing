from typing import Optional, Any, Dict
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    income_range: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None
    behavioral_features: Optional[Dict[str, Any]] = None

class UserInDBBase(UserBase):
    id: int
    is_active: bool
    risk_score: Optional[float] = None
    risk_category: Optional[str] = None
    wallet_balance: float = 0.0

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass
