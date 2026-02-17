from sqlalchemy.orm import Session
from app.models.user_model import User
from app.core.security import hash_password, verify_password, create_access_token


# Create a new user entry in the database
def create(db: Session, username: str, email: str, password: str):
    hashed_password = hash_password(password)

    db_user = User(username=username, email=email, hashed_password=hashed_password)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Retrieve a user by their email address
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Retrieve a user by their ID
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# Authenticate a user by verifying their email and password
def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# Generate an access token for a user
def login(db: Session, email: str, password: str):
    user = authenticate_user(db, email, password)
    if not user:
        return None
    return create_access_token(data={"sub": user.id})