from sqlalchemy import Column, Integer, String, DateTime, func
from app.db.session import Base

class URL(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    original_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    clicks = Column(Integer, default=0)