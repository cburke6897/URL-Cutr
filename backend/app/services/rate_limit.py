from fastapi import HTTPException
from app.services.cache import redis_client

# Implements a simple rate limiting mechanism using Redis to track the number of requests from a given IP address within a specified time window.
def rate_limit(ip: str, limit: int, window: int = 60):
    key = f"rate_limit:{ip}"
    count = redis_client.get(key)

    if count and int(count) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests. Try again later.")
    
    pipe = redis_client.pipeline()
    pipe.incr(key)
    pipe.expire(key, window)
    pipe.execute()