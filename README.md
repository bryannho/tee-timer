# Tee Timer API

A FastAPI application for managing golf course tee times.

## Features

- Users can view available tee times
- Users can sign up for tee times
- Golf courses can create and manage tee times
- Courses can assign users to tee times

## Tech Stack

- Python 3.8+
- FastAPI
- SQLModel (combines SQLAlchemy Core + Pydantic)
- SQLite database (can be configured to use other databases)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tee-timer.git
cd tee-timer
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the API:
```bash
uvicorn main:app --reload
```

2. The API will be available at http://127.0.0.1:8000

3. Access the API documentation at http://127.0.0.1:8000/docs

4. (Optional) Seed the database with sample data:
```bash
python seed_data.py
```

## API Endpoints

### Users
- `GET /users/` - List all users
- `GET /users/{user_id}` - Get a specific user
- `POST /users/` - Create a new user

### Courses
- `GET /courses/` - List all golf courses
- `GET /courses/{course_id}` - Get a specific golf course
- `POST /courses/` - Create a new golf course

### Tee Times
- `GET /tee-times/` - List all tee times
- `GET /tee-times/{tee_time_id}` - Get a specific tee time
- `POST /tee-times/` - Create a new tee time
- `PUT /tee-times/{tee_time_id}/assign` - Assign a user to a tee time

## Project Structure

```
tee-timer/
│
├── app/
│   ├── config/
│   │   ├── __init__.py
│   │   └── database.py
│   ├── models.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── users.py
│   │   ├── courses.py
│   │   └── tee_times.py
│   └── __init__.py
│
├── main.py
├── requirements.txt
├── seed_data.py
└── README.md
```