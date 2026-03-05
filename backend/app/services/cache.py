import redis
from app.core.config import settings

redis_client = None

if settings.redis_url:
    redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)