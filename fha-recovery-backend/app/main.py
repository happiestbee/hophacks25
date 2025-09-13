from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, bbt, meals, ai

app = FastAPI(
    title="FHA Recovery API",
    description="A gentle, supportive API for FHA recovery journey tracking",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(bbt.router, prefix="/api/bbt", tags=["bbt"])
app.include_router(meals.router, prefix="/api/meals", tags=["meals"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to FHA Recovery API",
        "version": "1.0.0",
        "docs": "/docs",
    }
