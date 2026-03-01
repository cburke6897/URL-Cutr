from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from backend.app.models.reset_token_model import ResetToken
from app.core.security import hash_reset_token, verify_reset_token

EXPIRE_MINUTES = 15

def save_reset_token(db: Session, user_email: str, token: str):
    hashed_token = hash_reset_token(token)

    reset_token = ResetToken(user_email=user_email, token=hashed_token, expires_at=datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES))
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)
    return reset_token


def verify_and_get_reset_token(db: Session, plain_token: str):
    # Get all non-expired tokens
    tokens = db.query(ResetToken).filter(
        ResetToken.expires_at > datetime.now(timezone.utc)
    ).all()
    
    # Check each token hash against the plain token
    for token_record in tokens:
        if verify_reset_token(plain_token, token_record.token):
            return token_record
    
    return None


def delete_reset_token(db: Session, token_id: int):
    token = db.query(ResetToken).filter(ResetToken.id == token_id).first()
    if token:
        db.delete(token)
        db.commit()
        return True
    return False