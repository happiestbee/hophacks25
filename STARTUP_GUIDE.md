# FHA Recovery App - Startup Guide

This guide explains how to start both the frontend and backend servers for development.

## Quick Start

### Option 1: Using npm (Recommended)
```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev
```

### Option 2: Using Shell Scripts
```bash
# Simple startup script
./start-dev.sh

# Advanced startup script (with better error handling and logging)
./start-dev-available.sh
```

## Available Commands

### Development
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend server
- `npm run dev:backend` - Start only the backend server

### Installation
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run install:frontend` - Install only frontend dependencies
- `npm run install:backend` - Install only backend dependencies

### Production
- `npm run start` - Start both servers in production mode
- `npm run build` - Build the frontend for production

### Code Quality
- `npm run format` - Format code in both frontend and backend
- `npm run lint` - Lint code in both frontend and backend

## Server URLs

Once started, you can access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Kill processes on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill processes on port 8000 (backend)
lsof -ti:8000 | xargs kill -9
```

### Backend Dependencies
If the backend fails to start:
```bash
cd fha-recovery-backend
poetry install
```

### Frontend Dependencies
If the frontend fails to start:
```bash
cd fha-recovery-app
npm install
```

## Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit code in either frontend or backend
3. **View Changes**: Both servers auto-reload on file changes
4. **Stop Servers**: Press `Ctrl+C` in the terminal

## Logs

- Frontend logs appear in the terminal
- Backend logs appear in the terminal
- Advanced script saves logs to `frontend.log` and `backend.log`
