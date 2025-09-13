#!/bin/bash

# FHA Recovery App - Development Startup Script
# This script starts both the frontend (Next.js) and backend (FastAPI) servers

echo "🚀 Starting FHA Recovery App Development Servers..."
echo "=================================================="

# Function to cleanup background processes on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start Backend Server (FastAPI)
echo "📡 Starting Backend Server (FastAPI) on http://localhost:8000"
cd fha-recovery-backend
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend Server (Next.js)
echo "🎨 Starting Frontend Server (Next.js) on http://localhost:3000"
cd fha-recovery-app
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting up!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID
