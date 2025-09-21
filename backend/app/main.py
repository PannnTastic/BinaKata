from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import init_db
from .routers import auth as auth_router
from .routers import children as children_router
from .routers import assessments as assessments_router
from .routers import dashboard as dashboard_router

app = FastAPI(title="BinaKata API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(auth_router.router)
app.include_router(children_router.router)
app.include_router(assessments_router.router)
app.include_router(dashboard_router.router)

@app.get("/")
def root():
    return {"ok": True, "service": "BinaKata API"}