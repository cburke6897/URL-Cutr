from sqlalchemy import Column, Integer, String, DateTime, BigInteger, func
from app.db.base_class import Base

class URL(Base):
    __tablename__ = "urls"

    id = Column(BigInteger, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    original_url = Column(String(2048), nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now())
    created_by = Column(BigInteger, nullable=True)
    delete_at = Column(DateTime(timezone=True), nullable=True)
    clicks = Column(Integer, default=0)