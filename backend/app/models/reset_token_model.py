from sqlalchemy import Column, Integer, String, DateTime, BigInteger, func
from app.db.base import Base

class ResetToken(Base):
    __tablename__ = "reset_tokens"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default= func.now())