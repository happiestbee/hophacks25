#!/bin/bash

# FHA Recovery App - Stop Services Script
# Stops all running frontend and backend processes

echo "🛑 Stopping FHA Recovery App services..."

# Kill processes on specific ports
echo "Stopping processes on ports 3000, 3001, 3006, 3007, 8000, 8001..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3006 | xargs kill -9 2>/dev/null || true
lsof -ti:3007 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:8001 | xargs kill -9 2>/dev/null || true

# Kill any Node.js processes that might be running Next.js
echo "Stopping Node.js processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Kill any Python processes that might be running uvicorn
echo "Stopping Python/uvicorn processes..."
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "app.main:app" 2>/dev/null || true

# Wait for processes to terminate
sleep 2

echo "✅ All services stopped!"
echo "To restart, run: ./cleanup-and-start.sh"
