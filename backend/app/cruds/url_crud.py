from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.url_model import URL

# Retrieve a URL entry from the database based on the provided code
def get_url_by_code(db: Session, code: str):
    return db.query(URL).filter(URL.code == code).first()

# Create a new URL entry in the database
def create(db: Session, original_url: str, code: str, delete_after: int):
    if delete_after is None:
        db_url = URL(code=code, original_url=original_url)
    else:
        db_url = URL(
            code=code,
            original_url=original_url,
            delete_at=datetime.now(timezone.utc) + timedelta(minutes=delete_after)
        )
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url