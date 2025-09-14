#!/bin/bash

# FHA Recovery App - Cleanup and Start Script
# Ensures frontend runs on localhost:3000 and backend on localhost:8001

echo "🧹 Cleaning up existing processes..."

# Kill processes on specific ports
echo "Stopping processes on ports 3000, 3001, 3006, 3007, 8000, 8001..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3006 | xargs kill -9 2>/dev/null || true
lsof -ti:3007 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:8001 | xargs kill -9 2>/dev/null || true

# Kill any Node.js processes that might be running Next.js
echo "Stopping any remaining Node.js processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Kill any Python processes that might be running uvicorn
echo "Stopping any remaining Python/uvicorn processes..."
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "app.main:app" 2>/dev/null || true

# Wait a moment for processes to fully terminate
sleep 2

echo "✅ Cleanup complete!"
echo ""
echo "🚀 Starting services..."

# Start backend on port 8001
echo "Starting backend on localhost:8001..."
cd fha-recovery-backend
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Start frontend on port 3000
echo "Starting frontend on localhost:3000..."
cd ../fha-recovery-app
PORT=3000 npm run dev &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "🎉 Services are starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8001"
echo "📚 API Docs: http://localhost:8001/docs"
echo ""
echo "To stop services, run: ./stop-services.sh"
echo "Or press Ctrl+C to stop this script and then run cleanup again."

# Keep script running and show logs
wait
