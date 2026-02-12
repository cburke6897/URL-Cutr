from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from app.api.routes.shorten import router as shorten_router

app = FastAPI()

Base.metadata.create_all(bind=engine)
app.include_router(shorten_router)