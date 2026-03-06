from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.url_routes import router as shorten_router
from app.api.routes.auth_routes import router as auth_router
from app.api.routes.reset_routes import router as reset_router
from app.api.routes.delete_routes import router as delete_router
from app.core.config import settings
from app.services.cleanup import delete_expired


delete_expired()

app = FastAPI()

app.include_router(shorten_router)
app.include_router(auth_router)
app.include_router(reset_router)
app.include_router(delete_router)

def add_www(url: str) -> str:
    if "://www." in url:
        return url
    return url.replace("://", "://www.", 1)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        add_www(settings.frontend_url)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
