from sqlalchemy import Column, String, DateTime, BigInteger, func
from app.db.base import Base

class DeleteToken(Base):
    __tablename__ = "delete_tokens"

    id = Column(BigInteger, primary_key=True, index=True)
    user_email = Column(String(255), nullable=False)
    token = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default= func.now())