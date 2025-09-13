from fastapi import APIRouter
from datetime import datetime, timedelta
from app.schemas.meals import Meal, MealResponse

router = APIRouter()

# Mock data for demonstration
mock_meals = [
    Meal(
        id=i,
        date=(datetime.now() - timedelta(days=7 - i)).date(),
        meal_type=["breakfast", "lunch", "dinner", "snack"][i % 4],
        description=f"Sample meal {i+1}",
        calories=300 + (i * 50),
        notes=f"Notes for meal {i+1}" if i % 3 == 0 else None,
    )
    for i in range(20)
]


@router.get("/", response_model=MealResponse)
async def get_meals():
    """Get logged meals"""
    return MealResponse(
        meals=mock_meals,
        total_calories=sum(m.calories for m in mock_meals),
        average_calories=sum(m.calories for m in mock_meals) / len(mock_meals)
        if mock_meals
        else 0,
    )


@router.post("/", response_model=Meal)
async def create_meal(meal: Meal):
    """Log a new meal"""
    meal.id = len(mock_meals) + 1
    mock_meals.append(meal)
    return meal
