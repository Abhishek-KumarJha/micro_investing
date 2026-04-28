from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=True) # e.g., "Food", "Entertainment", "Utilities"
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # For micro-investing
    round_off_amount = Column(Float, default=0.0) # e.g., amount = 93, round_off_amount = 7
    is_invested = Column(Boolean, default=False)
    
    user = relationship("User", backref="transactions")
