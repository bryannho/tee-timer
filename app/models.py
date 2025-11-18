from datetime import datetime
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship

class UserBase(SQLModel):
    """Base model for user data."""
    name: str
    email: str
    phone: Optional[str] = None

class User(UserBase, table=True):
    """User model for database storage."""
    id: Optional[int] = Field(default=None, primary_key=True)

    # Relationships
    tee_times: List["TeeTime"] = Relationship(back_populates="user")

class CourseBase(SQLModel):
    """Base model for golf course data."""
    name: str
    location: str
    holes: int = 18

class Course(CourseBase, table=True):
    """Course model for database storage."""
    id: Optional[int] = Field(default=None, primary_key=True)

    # Relationships
    tee_times: List["TeeTime"] = Relationship(back_populates="course")

class TeeTimeBase(SQLModel):
    """Base model for tee time data."""
    start_time: datetime
    course_id: Optional[int] = Field(default=None, foreign_key="course.id")
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    status: str = "available"  # available, booked, completed

class TeeTime(TeeTimeBase, table=True):
    """TeeTime model for database storage."""
    id: Optional[int] = Field(default=None, primary_key=True)

    # Relationships
    course: Optional[Course] = Relationship(back_populates="tee_times")
    user: Optional[User] = Relationship(back_populates="tee_times")

class UserCreate(UserBase):
    """Schema for creating a new user."""
    pass

class CourseCreate(CourseBase):
    """Schema for creating a new course."""
    pass

class TeeTimeCreate(SQLModel):
    """Schema for creating a new tee time."""
    start_time: datetime
    course_id: int

class TeeTimeAssign(SQLModel):
    """Schema for assigning a user to a tee time."""
    user_id: int

class TeeTimeResponse(SQLModel):
    """Schema for tee time response data."""
    id: int
    start_time: datetime
    course_id: int
    user_id: Optional[int] = None
    status: str