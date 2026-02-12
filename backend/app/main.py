from fastapi import FastAPI
from app.api.routes.shorten import router as shorten_router

app = FastAPI()

app.include_router(shorten_router)