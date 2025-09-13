from pydantic import BaseModel
from typing import List, Optional


class MealSuggestion(BaseModel):
    title: str
    description: str
    ingredients: List[str]
    instructions: List[str]
    nutrition_notes: str
    encouragement: str


class MealInspiration(BaseModel):
    id: str
    title: str
    description: str
    image_url: Optional[str] = None
    prep_time: str
    nutrition_highlights: str
    why_recommended: str


class MealInspirationRequest(BaseModel):
    logged_meals: List[dict]  # List of meals logged today


class MealInspirationResponse(BaseModel):
    suggestions: List[MealInspiration]
    daily_analysis: str
    encouragement: str


class RecipeRequest(BaseModel):
    meal_id: str
    meal_title: str


class FullRecipe(BaseModel):
    title: str
    description: str
    prep_time: str
    cook_time: str
    servings: int
    ingredients: List[str]
    instructions: List[str]
    nutrition_notes: str
    tips: List[str]
    encouragement: str


class Affirmation(BaseModel):
    text: str
    category: str
    encouragement: str
