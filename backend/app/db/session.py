from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Retrieves a database session for each request and ensures it is closed after the request is processed
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()