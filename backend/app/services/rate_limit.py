from fastapi import HTTPException
from app.services.cache import redis_client
import time

rate_limits = {}

# Implements a simple rate limiting mechanism using Redis to track the number of requests from a given IP address within a specified time window.
def rate_limit(ip: str, limit: int = 5, window: int = 60):
    if redis_client:
        key = f"rate_limit:{ip}"
        count = redis_client.get(key)

        if count and int(count) >= limit:
            raise HTTPException(status_code=429, detail="Too many requests. Try again later.")
        
        pipe = redis_client.pipeline()
        pipe.incr(key)
        pipe.expire(key, window)
        pipe.execute()
    else: # Fallback to in-memory rate limiting if Redis is not available
        if ip not in rate_limits:
            rate_limits[ip] = []

        now = time.time()

        # Remove timestamps outside the window
        rate_limits[ip] = [t for t in rate_limits[ip] if now - t < window]

        if len(rate_limits[ip]) >= limit:
            raise HTTPException(status_code=429, detail="Too many requests. Try again later.")

        rate_limits[ip].append(now)
