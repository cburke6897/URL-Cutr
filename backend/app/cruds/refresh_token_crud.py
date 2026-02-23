from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.refresh_token_model import RefreshToken

def save_refresh_token(db: Session, user_id: int, token: str) :
    refresh_token = RefreshToken(user_id=user_id, token=token, expires_at=datetime.utcnow() + timedelta(days=7))
    db.add(refresh_token)
    db.commit()
    db.refresh(refresh_token)
    return refresh_token

def refresh_token_exists(db: Session, token: str) -> bool:
    return db.query(RefreshToken).filter(RefreshToken.token == token, RefreshToken.expires_at > datetime.now(timezone.utc)).first()

def delete_refresh_token(db: Session, token: str):
    db.query(RefreshToken).filter(RefreshToken.token == token).delete()
    db.commit()