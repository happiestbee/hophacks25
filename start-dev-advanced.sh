#!/bin/bash

# FHA Recovery App - Advanced Development Startup Script
# This script provides better process management and logging

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to cleanup background processes
cleanup() {
    print_status "Shutting down servers..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

print_status "🚀 Starting FHA Recovery App Development Servers"
echo "=================================================="

# Check if ports are available
if check_port 8000; then
    print_warning "Port 8000 is already in use. Backend may not start properly."
fi

if check_port 3000; then
    print_warning "Port 3000 is already in use. Frontend may not start properly."
fi

# Start Backend Server (FastAPI)
print_status "📡 Starting Backend Server (FastAPI) on http://localhost:8000"
cd fha-recovery-backend

# Check if Poetry is available
if ! command -v poetry &> /dev/null; then
    print_error "Poetry is not installed. Please install Poetry first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d ".venv" ]; then
    print_status "Installing backend dependencies..."
    poetry install
fi

poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_status "Waiting for backend to start..."
sleep 5

# Check if backend started successfully
if ! check_port 8000; then
    print_error "Backend failed to start. Check backend.log for details."
    exit 1
fi

print_success "Backend server started successfully!"

# Start Frontend Server (Next.js)
print_status "🎨 Starting Frontend Server (Next.js) on http://localhost:3000"
cd fha-recovery-app

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
print_status "Waiting for frontend to start..."
sleep 5

# Check if frontend started successfully
if ! check_port 3000; then
    print_error "Frontend failed to start. Check frontend.log for details."
    exit 1
fi

print_success "Frontend server started successfully!"

echo ""
echo "✅ Both servers are running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Logs:"
echo "   Frontend: tail -f frontend.log"
echo "   Backend:  tail -f backend.log"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID
