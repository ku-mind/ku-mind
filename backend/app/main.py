from fastapi import FastAPI
from fastapi.responses import Response

app = FastAPI(title="KU Mind API")


@app.get("/")
def root():
    return {"message": "KU Mind API is running", "health": "/health"}


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)
