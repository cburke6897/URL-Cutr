from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.security import hash_string, verify_string
from app.models.delete_token_model import DeleteToken

EXPIRE_MINUTES = 15

def save_delete_token(db: Session, user_email: str, token: str):
    # Delete any existing tokens for this user
    for token_record in db.query(DeleteToken).filter(DeleteToken.user_email == user_email).all():
        db.delete(token_record)

    hashed_token = hash_string(token)
    delete_token = DeleteToken(user_email=user_email, token=hashed_token, expires_at=datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES))
    db.add(delete_token)
    db.commit()
    db.refresh(delete_token)
    return delete_token


def verify_and_get_delete_token(db: Session, plain_token: str):
    # Get all non-expired tokens
    tokens = db.query(DeleteToken).filter(
        DeleteToken.expires_at > datetime.now(timezone.utc)
    ).all()
    
    # Check each token hash against the plain token
    for token_record in tokens:
        if verify_string(plain_token, token_record.token):
            return token_record
    
    return None


def delete_delete_token(db: Session, token_id: int):
    token = db.query(DeleteToken).filter(DeleteToken.id == token_id).first()
    if token:
        db.delete(token)
        db.commit()
        return True
    return False