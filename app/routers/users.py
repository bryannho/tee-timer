from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.config.database import get_session
from app.models import User, UserCreate

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[User])
def get_all_users(
    session: Session = Depends(get_session),
):
    """Get all users."""
    users = session.exec(select(User)).all()
    return users

@router.get("/{user_id}", response_model=User)
def get_user(
    user_id: int,
    session: Session = Depends(get_session),
):
    """Get a specific user by ID."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    return user

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    session: Session = Depends(get_session),
):
    """Create a new user."""
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    db_user = User.from_orm(user)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user