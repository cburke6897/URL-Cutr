import asyncio
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.db.base import Base
from app.api.routes.url_routes import router as shorten_router
from app.api.routes.auth import router as auth_router
from app.core.tlds import load_tlds
from app.services.cleanup import delete_expired_urls_periodically


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load valid TLDs at startup
    await load_tlds()
    # Start the periodic cleanup task to delete expired URLs
    asyncio.create_task(delete_expired_urls_periodically())
    # Create database tables based on the defined models
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(shorten_router)
app.include_router(auth_router)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)