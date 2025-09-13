# FHA Recovery Backend API

A FastAPI backend for the FHA Recovery web application, providing gentle, supportive APIs for health tracking and recovery journey support.

## Features

- **BBT Tracking**: API endpoints for basal body temperature data
- **Meal Logging**: Gentle nutrition tracking and meal suggestions
- **AI Support**: Recovery-friendly meal suggestions and daily affirmations
- **Health Monitoring**: Basic health metrics and progress tracking

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Poetry**: Dependency management and virtual environment
- **Pydantic**: Data validation and serialization
- **scikit-learn**: Machine learning for health insights
- **pandas/numpy**: Data manipulation and analysis
- **SQLAlchemy**: Database ORM (ready for PostgreSQL)
- **Redis**: Caching layer

## Development Setup

1. **Install Poetry** (if not already installed):
   ```bash
   pip install poetry
   ```

2. **Install dependencies**:
   ```bash
   poetry install
   ```

3. **Run the development server**:
   ```bash
   poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Access the API**:
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/api/health

## Code Quality

- **Black**: Code formatting
- **Flake8**: Linting

Run formatting and linting:
```bash
poetry run black .
poetry run flake8 .
```

## API Endpoints

### Health
- `GET /api/health` - Health check

### BBT Tracking
- `GET /api/bbt/` - Get BBT readings
- `POST /api/bbt/` - Create new BBT reading

### Meals
- `GET /api/meals/` - Get logged meals
- `POST /api/meals/` - Log new meal

### AI Support
- `GET /api/ai/meal-suggestion` - Get recovery-friendly meal suggestion
- `GET /api/ai/daily-affirmation` - Get daily affirmation

## Project Structure

```
app/
├── main.py              # FastAPI application
├── routers/             # API route handlers
│   ├── health.py
│   ├── bbt.py
│   ├── meals.py
│   └── ai.py
├── schemas/             # Pydantic models
│   ├── bbt.py
│   ├── meals.py
│   └── ai.py
├── models/              # Database models (future)
└── core/                # Core utilities (future)
```

## Design Principles

This API follows the gentle, supportive approach outlined in the requirements:
- Encouraging and non-triggering language
- Compassionate data handling
- Recovery-focused features
- Privacy and security considerations
