from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from pathlib import Path

# Import routes
from .routes.events import router as events_router
from .routes.restaurants import router as restaurants_router
from .routes.products import router as products_router
from .routes.posts import router as posts_router
from .routes.users import router as users_router
from .routes.translation import router as translation_router
from .routes.admin import router as admin_router
from .routes.providers import router as providers_router
from .routes.notifications import router as notifications_router

# Import database functions
from .database import init_database
from .seed_data import seed_database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_database()
    # Seed database if empty
    try:
        await seed_database()
    except Exception as e:
        logging.warning(f"Database seeding failed: {e}")
    
    yield
    # Shutdown
    pass

# Create the main app
app = FastAPI(
    title="EJI - Algeria Tourism API",
    description="API for EJI Algeria Tourism Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add your routes to the router
@api_router.get("/")
async def root():
    return {"message": "Welcome to EJI API - Algeria Tourism Platform"}

# Include all routers
api_router.include_router(events_router)
api_router.include_router(restaurants_router)
api_router.include_router(products_router)
api_router.include_router(posts_router)
api_router.include_router(users_router)
api_router.include_router(translation_router)
api_router.include_router(admin_router)
api_router.include_router(providers_router)
api_router.include_router(notifications_router)

# Include the router in the main app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)