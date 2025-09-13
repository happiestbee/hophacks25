from pydantic import BaseModel
from datetime import date
from typing import List, Optional


class Meal(BaseModel):
    id: Optional[int] = None
    date: date
    meal_type: str  # breakfast, lunch, dinner, snack
    description: str
    calories: int
    notes: Optional[str] = None


class MealResponse(BaseModel):
    meals: List[Meal]
    total_calories: int
    average_calories: float
