from sqlmodel import Session, SQLModel, create_engine
import os
from dotenv import load_dotenv

# Load environment variables from .env file (if exists)
load_dotenv()

# Get database URL from environment or use a default SQLite database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///tee_timer.db")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    connect_args={"check_same_thread": False}  # Needed only for SQLite
)

def create_db_and_tables():
    """Create all tables in the database."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency for getting a database session."""
    with Session(engine) as session:
        yield session