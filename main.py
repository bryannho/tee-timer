from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import create_db_and_tables
from app.routers import users, courses, tee_times

app = FastAPI(
    title="Tee Timer API",
    description="API for managing golf course tee times",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(tee_times.router)

@app.on_event("startup")
def on_startup():
    """Create database tables on startup."""
    create_db_and_tables()

@app.get("/")
def read_root():
    """Root endpoint, provides basic API information."""
    return {
        "name": "Tee Timer API",
        "version": "0.1.0",
        "documentation": "/docs",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)