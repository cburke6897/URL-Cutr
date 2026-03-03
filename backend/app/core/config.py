from pydantic_settings import BaseSettings

# Configuration class to load settings from environment variables
class Settings(BaseSettings):
    database_url: str
    redis_url: str
    access_token_secret_key: str
    refresh_token_secret_key: str
    resend_api_key: str
    support_email: str
    frontend_url: str = "http://localhost:5173"  # Default to localhost for development

    class Config:
        env_file = ".env"

settings = Settings()
logging.info("REDIS_URL RAW VALUE: %r", settings.redis_url
