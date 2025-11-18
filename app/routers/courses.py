from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.config.database import get_session
from app.models import Course, CourseCreate

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/", response_model=List[Course])
def get_all_courses(
    session: Session = Depends(get_session),
):
    """Get all courses."""
    courses = session.exec(select(Course)).all()
    return courses

@router.get("/{course_id}", response_model=Course)
def get_course(
    course_id: int,
    session: Session = Depends(get_session),
):
    """Get a specific course by ID."""
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID {course_id} not found"
        )
    return course

@router.post("/", response_model=Course, status_code=status.HTTP_201_CREATED)
def create_course(
    course: CourseCreate,
    session: Session = Depends(get_session),
):
    """Create a new course."""
    # Check if a course with the same name and location already exists
    existing_course = session.exec(
        select(Course)
        .where(Course.name == course.name)
        .where(Course.location == course.location)
    ).first()

    if existing_course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A course with this name and location already exists"
        )

    # Create new course
    db_course = Course.from_orm(course)
    session.add(db_course)
    session.commit()
    session.refresh(db_course)

    return db_course