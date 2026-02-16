from sqlalchemy.orm import Session
from app.models.user_model import User
from app.core.security import hash_password


# Create a new user entry in the database
def create(db: Session, username: str, email: str, password: str):
    hashed_password = hash_password(password)

    db_user = User(username=username, email=email, hashed_password=hashed_password)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Retrieve a user by their email address
def get_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()