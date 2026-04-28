from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class TransactionBase(BaseModel):
    amount: float
    category: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionInDBBase(TransactionBase):
    id: int
    user_id: int
    timestamp: datetime
    round_off_amount: float
    is_invested: bool

    class Config:
        from_attributes = True

class Transaction(TransactionInDBBase):
    pass
