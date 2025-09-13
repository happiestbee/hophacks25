# FHA Recovery Web Application

A gentle, supportive web application for Functional Hypothalamic Amenorrhea (FHA) recovery, built with Next.js and FastAPI.

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev
```

## 📁 Project Structure

```
hophacks25/
├── fha-recovery-app/          # Next.js Frontend
├── fha-recovery-backend/      # FastAPI Backend
├── docs/                      # Documentation
├── package.json               # Root dependencies & scripts
└── scripts/                   # Utility scripts
```

## 🛠️ Available Commands

### Development
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend

### Installation
- `npm run install:all` - Install all dependencies
- `npm run install:frontend` - Install frontend dependencies
- `npm run install:backend` - Install backend dependencies

### Code Quality
- `npm run format` - Format code in both projects
- `npm run lint` - Lint code in both projects

### Cleanup & Optimization
- `npm run clean` - Remove build artifacts and OS files
- `npm run clean:full` - Remove everything including node_modules
- `npm run size` - Show current project size
- `./build-production.sh` - Create optimized production build

## 🌐 Server URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📊 Project Size

The project is currently **~533MB** in development mode, which is normal for a full-stack Next.js + FastAPI application. See [SIZE_OPTIMIZATION.md](SIZE_OPTIMIZATION.md) for detailed information about size optimization.

## 🧹 Size Optimization

For a smaller project size:

```bash
# Remove build artifacts and OS files
npm run clean

# Remove everything including node_modules (minimal size)
npm run clean:full

# Reinstall when needed
npm run install:all
```

## 🏗️ Production Build

```bash
# Create optimized production build
./build-production.sh
```

## 📚 Documentation

- [Startup Guide](STARTUP_GUIDE.md) - How to start the application
- [Size Optimization](SIZE_OPTIMIZATION.md) - Detailed size optimization guide
- [Requirements](docs/requirements.md) - Technical requirements and design principles
- [Tasks](docs/tasks.md) - Development tasks and progress

## 🎯 Features

- **Gentle BBT Tracking**: Compassionate health monitoring
- **Meal Logging**: Supportive nutrition tracking
- **AI Suggestions**: Recovery-friendly meal recommendations
- **Self-Love Space**: Affirmation board and daily encouragement
- **Clean Design**: Fresh, minimalist aesthetic following FHA recovery principles

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework with SSR/SSG
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Nivo** - Data visualization

### Backend
- **FastAPI** - Modern Python web framework
- **Poetry** - Dependency management
- **Pydantic** - Data validation
- **scikit-learn** - Machine learning
- **SQLAlchemy** - Database ORM

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
