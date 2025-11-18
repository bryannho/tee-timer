"""
Seed data script for Tee Timer API
Run this script to populate the database with initial test data
"""
import datetime
from sqlmodel import Session

from app.config.database import engine
from app.models import User, Course, TeeTime

# Sample data
users = [
    {"name": "John Doe", "email": "john@example.com", "phone": "555-1234"},
    {"name": "Jane Smith", "email": "jane@example.com", "phone": "555-5678"},
    {"name": "Bob Johnson", "email": "bob@example.com", "phone": "555-9012"},
]

courses = [
    {"name": "Pine Valley Golf Club", "location": "Pine Valley, NJ", "holes": 18},
    {"name": "Cypress Point Club", "location": "Pebble Beach, CA", "holes": 18},
    {"name": "Oakmont Country Club", "location": "Oakmont, PA", "holes": 18},
    {"name": "Augusta National", "location": "Augusta, GA", "holes": 18},
    {"name": "Merion Golf Club", "location": "Ardmore, PA", "holes": 18},
]

# Generate tee times for the next 7 days
def generate_tee_times(course_id):
    tee_times = []
    for day in range(7):  # Next 7 days
        today = datetime.datetime.now().date()
        current_date = today + datetime.timedelta(days=day)

        # Create tee times from 7AM to 5PM with 15-minute intervals
        for hour in range(7, 17):
            for minute in [0, 15, 30, 45]:
                start_time = datetime.datetime.combine(
                    current_date,
                    datetime.time(hour=hour, minute=minute)
                )
                tee_time = {
                    "start_time": start_time,
                    "course_id": course_id,
                    "status": "available"
                }
                tee_times.append(tee_time)

    return tee_times

def seed_database():
    """Seed the database with initial test data."""
    with Session(engine) as session:
        # Add users
        db_users = []
        for user_data in users:
            user = User(**user_data)
            session.add(user)
            db_users.append(user)

        # Add courses
        db_courses = []
        for course_data in courses:
            course = Course(**course_data)
            session.add(course)
            db_courses.append(course)

        # We need to commit to get IDs for the courses
        session.commit()

        # Add tee times for each course
        for course in db_courses:
            tee_times_data = generate_tee_times(course.id)
            for tee_time_data in tee_times_data:
                tee_time = TeeTime(**tee_time_data)
                session.add(tee_time)

        # Commit all changes
        session.commit()

        print(f"Database seeded with {len(db_users)} users, {len(db_courses)} courses, and tee times for the next 7 days.")

if __name__ == "__main__":
    seed_database()