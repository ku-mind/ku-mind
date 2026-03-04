import os


class Settings:
    def __init__(self):
        self.app_name: str = os.getenv("APP_NAME", "KU Mind API")
        self.database_url: str = os.getenv("DATABASE_URL", "sqlite:///./ku_mind.db")


settings = Settings()
