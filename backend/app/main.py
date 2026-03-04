from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import Response

from app.api.router import api_router
from app.core.config import settings
from app.db.session import Base, engine

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.exception_handler(HTTPException)
def http_exception_handler(_: Request, exc: HTTPException):
    message = exc.detail if isinstance(exc.detail, str) else "Request failed"
    return JSONResponse(status_code=exc.status_code, content={"message": message})


@app.get("/")
def root():
    return {"message": "KU Mind API is running", "health": "/health"}


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)
