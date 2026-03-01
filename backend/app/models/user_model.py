from sqlalchemy import Column, String, DateTime, BigInteger, Boolean, func
from app.db.base import Base
from fastapi import HTTPException
from app.core.security import hash_string, verify_string

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default= func.now())
    admin = Column(Boolean, default=False)
    
    def set_password(self, plain_password: str):
        if(verify_string(plain_password, self.hashed_password)):
            raise HTTPException(status_code=400, detail="New password must be different from the current password")

        self.hashed_password = hash_string(plain_password)