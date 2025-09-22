from pydantic_settings import BaseSettings
from typing import List, Any
from pydantic import field_validator
import os, json

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./binakata.db")
    jwt_secret: str = os.getenv("JWT_SECRET", "change_me")
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    model_dir: str = os.getenv("MODEL_DIR", "app/ml/models")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> Any:
      # Accept JSON array or comma-separated string
      if isinstance(v, str):
        s = v.strip()
        if s.startswith("["):
          try:
            arr = json.loads(s)
            if isinstance(arr, list):
              return [str(x) for x in arr]
          except Exception:
            pass
        return [i.strip() for i in s.split(",") if i.strip()]
      return v

settings = Settings()
