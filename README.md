# Tee Timer

A full-stack application for managing golf course tee times.

## Features

- Users can view available tee times
- Users can sign up for tee times
- Golf courses can create and manage tee times
- Courses can assign users to tee times

## Tech Stack

### Backend
- Python 3.8+
- FastAPI
- SQLModel (combines SQLAlchemy Core + Pydantic)
- SQLite database (can be configured to use other databases)

### Frontend
- React
- React Router
- Axios
- Vite

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tee-timer.git
cd tee-timer
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

## Usage

### Option 1: Start both backend and frontend with single script

```bash
# Make the start script executable
chmod +x start.sh

# Run the script to start both services
./start.sh
```

### Option 2: Start services separately

1. Start the backend API:
```bash
# In the root directory
uvicorn main:app --reload
```

2. Seed the database with sample data (optional):
```bash
python seed_data.py
```

3. Start the frontend (in a separate terminal):
```bash
cd client
npm start
```

### Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API documentation: http://localhost:8000/docs

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
├── app/                      # Backend API code
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
├── client/                   # Frontend React application
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.jsx           # Main app component
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── main.py                   # FastAPI app entry point
├── requirements.txt          # Backend dependencies
├── seed_data.py              # Database seeding script
├── start.sh                  # Script to start both frontend and backend
└── README.md
```