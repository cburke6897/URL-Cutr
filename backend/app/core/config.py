from pydantic_settings import BaseSettings

# Configuration class to load settings from environment variables
class Settings(BaseSettings):
    database_url: str
    redis_url: str
    secret_key: str

    class Config:
        env_file = ".env"

settings = Settings()