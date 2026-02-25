from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.url_model import URL

# Retrieve a URL entry from the database based on the provided code
def get_url_by_code(db: Session, code: str):
    return db.query(URL).filter(URL.code == code).first()

# Retrieve all URL entries from the database for a specific user
def get_urls_by_user(db: Session, user_id: int):
    return db.query(URL).filter(URL.created_by == user_id).order_by(URL.created_at.desc()).all()

# Create a new URL entry in the database
def create(db: Session, original_url: str, code: str, delete_after: int, created_by: int | None = None):
    if delete_after is None:
        db_url = URL(code=code, original_url=original_url, created_by=created_by)
    else:
        db_url = URL(
            code=code,
            original_url=original_url,
            delete_at=datetime.now(timezone.utc) + timedelta(minutes=delete_after),
            created_by=created_by
        )
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url

# Delete a URL entry from the database based on the provided code
def delete(db: Session, code: str):
    url = db.query(URL).filter(URL.code == code).first()
    if url:
        db.delete(url)
        db.commit()
        return True
    return False