from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.transaction import Transaction

router = APIRouter()

@router.post("/invest_now")
def invest_now(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Invests all available round-offs.
    """
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_invested == False
    ).all()
    
    total_invested = 0
    for tx in transactions:
        total_invested += tx.round_off_amount
        tx.is_invested = True
        
    current_user.wallet_balance += total_invested
    db.commit()
    return {"message": "Success", "total_invested": total_invested}
