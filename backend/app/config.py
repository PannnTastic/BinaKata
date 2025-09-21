from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./binakata.db")
    jwt_secret: str = os.getenv("JWT_SECRET", "change_me")
    cors_origins: List[str] = (
        os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    )
    model_dir: str = os.getenv("MODEL_DIR", "app/ml/models")

settings = Settings()