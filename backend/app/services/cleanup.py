from app.models.url_model import URL
from app.db.session import SessionLocal
from datetime import datetime, timezone
import asyncio

async def delete_expired_urls_periodically(period_seconds: int = 60):
    while True:
        delete_expired_urls()
        # Wait for 1 hour before checking again
        await asyncio.sleep(period_seconds)

def delete_expired_urls():
    db = SessionLocal()
    try:
        # Query the database for URLs that have a delete_at timestamp in the past
        expired_urls = db.query(URL).filter(URL.delete_at != None, URL.delete_at < datetime.now(timezone.utc)).all()
        for url in expired_urls:
            db.delete(url)
        db.commit()
    finally:
        db.close()