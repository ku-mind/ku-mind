from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.user_repo import UserRepository
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserOut


class AuthService:
    def __init__(self, db: Session):
        self.users = UserRepository(db)

    def register(self, payload: RegisterRequest) -> AuthResponse:
        email = payload.email.strip().lower()
        if "@" not in email or "." not in email.split("@")[-1]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="รูปแบบอีเมลไม่ถูกต้อง")

        if self.users.get_by_email(email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="อีเมลนี้ถูกใช้งานแล้ว")

        user = self.users.create(
            name=payload.name.strip(),
            email=email,
            password_hash=hash_password(payload.password),
        )
        return AuthResponse(
            user=UserOut(id=user.id, name=user.name, email=user.email),
            token=create_access_token(user.id, user.email),
        )

    def login(self, payload: LoginRequest) -> AuthResponse:
        email = payload.email.strip().lower()
        user = self.users.get_by_email(email)

        if user is None or not verify_password(payload.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="อีเมลหรือรหัสผ่านไม่ถูกต้อง",
            )

        return AuthResponse(
            user=UserOut(id=user.id, name=user.name, email=user.email),
            token=create_access_token(user.id, user.email),
        )
