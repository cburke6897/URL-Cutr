from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.db.base import Base
from app.api.routes.routes import router as shorten_router
from app.core.tlds import load_tlds


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load valid TLDs at startup
    await load_tlds()
    yield

app = FastAPI(lifespan=lifespan)


# Create database tables based on the defined models
Base.metadata.create_all(bind=engine)
app.include_router(shorten_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)