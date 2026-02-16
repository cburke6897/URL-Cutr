from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger
from app.db.base import Base

class URL(Base):
    __tablename__ = "urls"

    id = Column(BigInteger, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    original_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    delete_at = Column(DateTime(timezone=True), nullable=True)
    clicks = Column(Integer, default=0)