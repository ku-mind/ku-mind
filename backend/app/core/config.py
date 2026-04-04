import os
from pathlib import Path


def _load_env_file() -> None:
    env_path = Path(__file__).resolve().parents[3] / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ[key.strip()] = value.strip()


_load_env_file()


class Settings:
    def __init__(self):
        self.app_name: str = os.getenv("APP_NAME", "KU Mind API")
        self.database_url: str = os.getenv("DATABASE_URL", "sqlite:///./ku_mind.db")
        self.jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
        self.jwt_expire_minutes: int = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))
        self.gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
        self.gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


settings = Settings()
