import hashlib
import hmac
import secrets


_ITERATIONS = 120_000
_ALGORITHM = "sha256"
_SALT_SIZE = 16


def hash_password(password: str) -> str:
    salt = secrets.token_hex(_SALT_SIZE)
    derived = hashlib.pbkdf2_hmac(
        _ALGORITHM,
        password.encode("utf-8"),
        salt.encode("utf-8"),
        _ITERATIONS,
    )
    return f"pbkdf2_{_ALGORITHM}${_ITERATIONS}${salt}${derived.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        scheme, iterations, salt, expected_hex = stored_hash.split("$", 3)
        if not scheme.startswith("pbkdf2_"):
            return False
        derived = hashlib.pbkdf2_hmac(
            _ALGORITHM,
            password.encode("utf-8"),
            salt.encode("utf-8"),
            int(iterations),
        )
        return hmac.compare_digest(derived.hex(), expected_hex)
    except Exception:
        return False


def create_access_token() -> str:
    return secrets.token_urlsafe(32)
