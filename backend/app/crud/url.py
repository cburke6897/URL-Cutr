from sqlalchemy.orm import Session
from app.models.url import URL

# Retrieve a URL entry from the database based on the provided code
def get_url_by_code(db: Session, code: str):
    return db.query(URL).filter(URL.code == code).first()

# Create a new URL entry in the database
def create(db: Session, original_url: str, code: str):
    db_url = URL(code=code, original_url=original_url)
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url