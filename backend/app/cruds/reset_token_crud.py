from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from backend.app.models.reset_token_model import ResetToken
from app.core.security import hash_reset_token

EXPIRE_MINUTES = 15


def save_reset_token(db: Session, user_id: int, token: str):
    hashed_token = hash_reset_token(token)

    reset_token = ResetToken(user_id=user_id, token=hashed_token, expires_at=datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES))
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)
    return reset_token