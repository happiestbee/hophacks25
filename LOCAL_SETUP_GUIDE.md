# FHA Recovery App - Local Development Setup Guide

This guide will walk you through setting up the FHA Recovery application on your local machine for development.

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software

1. **Python 3.11+**
   - Download from [python.org](https://www.python.org/downloads/)
   - Verify installation: `python --version` or `python3 --version`

2. **Poetry** (Python dependency management)
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```
   - Add Poetry to your PATH (follow the installation instructions)
   - Verify installation: `poetry --version`

3. **Node.js 18+**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

4. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hophacks25
```

### 2. Install Dependencies

The project includes scripts to install all dependencies at once:

```bash
# Install both frontend and backend dependencies
npm run install:all
```

Or install them separately:

```bash
# Frontend dependencies
npm run install:frontend

# Backend dependencies
npm run install:backend
```

### 3. Environment Variables Setup

#### Backend Environment Variables

1. Copy the backend environment template:
   ```bash
   cp fha-recovery-backend/.env.example fha-recovery-backend/.env
   ```

2. Edit `fha-recovery-backend/.env` and configure:
   ```env
   # Gemini API Configuration
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   
   # FastAPI Configuration
   DEBUG=True
   HOST=0.0.0.0
   PORT=8001
   
   # Database Configuration (SQLite by default)
   DATABASE_URL=sqlite:///./fha_recovery.db
   ```

   **Getting a Gemini API Key:**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Sign in with your Google account
   - Click "Get API key" and create a new key
   - Copy the key and paste it in your `.env` file

#### Frontend Environment Variables

1. Copy the frontend environment template:
   ```bash
   cp fha-recovery-app/.env.example fha-recovery-app/.env.local
   ```

2. Edit `fha-recovery-app/.env.local` and configure:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=lMjDNu6Zkb5NUu2k8IqEhlptIDUhHKgFhN/8FACJyho=
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
   ```

   **Setting up Google OAuth:**
   
   1. Go to [Google Cloud Console](https://console.cloud.google.com/)
   2. Create a new project or select an existing one
   3. Enable the Google+ API:
      - Go to "APIs & Services" > "Library"
      - Search for "Google+ API" and enable it
   4. Create OAuth 2.0 credentials:
      - Go to "APIs & Services" > "Credentials"
      - Click "Create Credentials" > "OAuth 2.0 Client ID"
      - Choose "Web application"
      - Add authorized redirect URIs:
        - `http://localhost:3000/api/auth/callback/google`
        - `http://localhost:3001/api/auth/callback/google`
        - `http://localhost:3002/api/auth/callback/google`
        - `http://localhost:3003/api/auth/callback/google`
        - `http://localhost:3004/api/auth/callback/google`
        - `http://localhost:3005/api/auth/callback/google`
        - `http://localhost:3006/api/auth/callback/google`
      - Copy the Client ID and Client Secret to your `.env.local` file

## Running the Application

### Option 1: Run Both Services Together (Recommended)

```bash
# Start both frontend and backend simultaneously
npm run dev
```

This will start:
- Backend API server on `http://localhost:8001`
- Frontend Next.js app on `http://localhost:3000` (or next available port)

### Option 2: Run Services Separately

#### Start Backend Only
```bash
npm run dev:backend
# Or alternatively:
cd fha-recovery-backend
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

#### Start Frontend Only
```bash
npm run dev:frontend
# Or alternatively:
cd fha-recovery-app
npm run dev
```

## Accessing the Application

Once both services are running:

1. **Frontend Application**: Open your browser to `http://localhost:3000` (or the port shown in terminal)
2. **Backend API Documentation**: Visit `http://localhost:8001/docs` for interactive API docs
3. **Database Admin Panel**: Visit `http://localhost:3000/admin/database` to view health profiles

## First Time Usage

### 1. Test the Application

1. Open the frontend in your browser
2. Click "Sign In with Google" to test OAuth integration
3. Complete the health survey (will be automatically prompted for new users)
4. Explore the different features:
   - BBT Tracker
   - Nourish & Thrive (meal logging with AI analysis)
   - Self-Love Space

### 2. Verify Backend Integration

1. Visit `http://localhost:8001/docs` to see the API documentation
2. Test the health profile endpoints
3. Check the database admin panel at `http://localhost:3000/admin/database`

## Troubleshooting

### Common Issues

#### Port Conflicts
If you get "Address already in use" errors:
- The backend tries to use port 8001 by default
- The frontend will automatically find an available port (3000, 3001, 3002, etc.)
- Check what's running on these ports: `lsof -i :8001` or `lsof -i :3000`

#### Missing Dependencies
```bash
# Reinstall all dependencies
npm run install:all

# Or install individually
cd fha-recovery-backend && poetry install
cd ../fha-recovery-app && npm install
```

#### Environment Variable Issues
- Ensure all `.env` files are properly configured
- Check that API keys are valid and have proper permissions
- Verify Google OAuth redirect URIs match your local setup

#### Database Issues
- The app uses SQLite by default, stored in `fha-recovery-backend/fha_recovery.db`
- To reset the database, delete this file and restart the backend
- Or use the "Clear Database" button in the admin panel

### Logs and Debugging

- **Backend logs**: Check the terminal running the backend service
- **Frontend logs**: Check browser developer console and terminal
- **API testing**: Use the interactive docs at `http://localhost:8001/docs`

## Development Commands

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Clean temporary files
npm run clean

# Check project size
npm run size
```

## Project Structure

```
hophacks25/
├── fha-recovery-app/          # Next.js frontend
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   └── ...
│   ├── .env.local            # Frontend environment variables
│   └── package.json
├── fha-recovery-backend/      # FastAPI backend
│   ├── app/
│   │   ├── models/           # Database models
│   │   ├── routers/          # API endpoints
│   │   ├── schemas/          # Pydantic schemas
│   │   └── core/             # Core functionality
│   ├── .env                  # Backend environment variables
│   └── pyproject.toml
└── package.json              # Root package.json with scripts
```

## Support

If you encounter issues:

1. Check this guide for common solutions
2. Verify all prerequisites are installed correctly
3. Ensure environment variables are properly configured
4. Check the terminal output for specific error messages
5. Test API endpoints using the interactive documentation

The application should now be running successfully on your local machine!
