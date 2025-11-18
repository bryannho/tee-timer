from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.config.database import get_session
from app.models import TeeTime, TeeTimeCreate, TeeTimeAssign, TeeTimeResponse

router = APIRouter(prefix="/tee-times", tags=["tee_times"])

@router.get("/", response_model=List[TeeTimeResponse])
def get_all_tee_times(
    session: Session = Depends(get_session),
):
    """Get all tee times."""
    tee_times = session.exec(select(TeeTime)).all()
    return tee_times

@router.get("/{tee_time_id}", response_model=TeeTimeResponse)
def get_tee_time(
    tee_time_id: int,
    session: Session = Depends(get_session),
):
    """Get a specific tee time by ID."""
    tee_time = session.get(TeeTime, tee_time_id)
    if not tee_time:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tee time with ID {tee_time_id} not found"
        )
    return tee_time

@router.post("/", response_model=TeeTimeResponse, status_code=status.HTTP_201_CREATED)
def create_tee_time(
    tee_time: TeeTimeCreate,
    session: Session = Depends(get_session),
):
    """Create a new tee time."""
    # Create new tee time
    db_tee_time = TeeTime.from_orm(tee_time)
    session.add(db_tee_time)
    session.commit()
    session.refresh(db_tee_time)
    return db_tee_time

@router.put("/{tee_time_id}/assign", response_model=TeeTimeResponse)
def assign_user_to_tee_time(
    tee_time_id: int,
    assignment: TeeTimeAssign,
    session: Session = Depends(get_session),
):
    """Assign a user to a tee time."""
    tee_time = session.get(TeeTime, tee_time_id)
    if not tee_time:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tee time with ID {tee_time_id} not found"
        )

    # Check if tee time is already assigned
    if tee_time.status != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This tee time is not available for booking"
        )

    # Update tee time with user assignment
    tee_time.user_id = assignment.user_id
    tee_time.status = "booked"

    session.add(tee_time)
    session.commit()
    session.refresh(tee_time)

    return tee_time