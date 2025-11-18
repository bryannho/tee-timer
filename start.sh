#!/bin/bash

# Start the FastAPI backend
echo "Starting FastAPI backend..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Optionally seed the database
echo "Seeding the database with sample data..."
python seed_data.py

# Change to client directory
cd client

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Start the frontend
echo "Starting React frontend..."
npm start

# Handle cleanup on exit
trap 'kill $BACKEND_PID' EXIT