from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class CheckInResult(Base):
    __tablename__ = "checkin_results"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    workload: Mapped[int] = mapped_column(Integer, nullable=False)
    sleep_hours: Mapped[float] = mapped_column(Float, nullable=False)
    fatigue: Mapped[int] = mapped_column(Integer, nullable=False)
    social_pressure: Mapped[int] = mapped_column(Integer, nullable=False)
    deadline_count: Mapped[int] = mapped_column(Integer, nullable=False)
    mood: Mapped[int] = mapped_column(Integer, nullable=False)
    additional_text: Mapped[str | None] = mapped_column(String(4000), nullable=True)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    score_breakdown: Mapped[dict] = mapped_column(JSON, nullable=False)
    recommendations: Mapped[list] = mapped_column(JSON, nullable=False)
    referral_options: Mapped[list] = mapped_column(JSON, nullable=False)
    summary: Mapped[str] = mapped_column(String(1000), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
