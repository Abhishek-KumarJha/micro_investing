from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, Transaction as TransactionSchema
import math

router = APIRouter()

@router.get("/", response_model=List[TransactionSchema])
def read_transactions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve transactions.
    """
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).offset(skip).limit(limit).all()
    return transactions

@router.post("/", response_model=TransactionSchema)
def create_transaction(
    *,
    db: Session = Depends(deps.get_db),
    transaction_in: TransactionCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new transaction. Calculates round-off for micro-investing.
    """
    round_off_amount = math.ceil(transaction_in.amount / 10.0) * 10 - transaction_in.amount
    if round_off_amount == 0:
        round_off_amount = 10.0 # Default min investment if it's already a round number
        
    transaction = Transaction(
        user_id=current_user.id,
        amount=transaction_in.amount,
        category=transaction_in.category,
        round_off_amount=round_off_amount,
        is_invested=False
    )
    db.add(transaction)
    
    # Update behavioral features in user profile (Mocked logic for simplicity, real ML would run periodically)
    # db.commit() will happen after everything
    db.commit()
    db.refresh(transaction)
    return transaction
