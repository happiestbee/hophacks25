from pydantic import BaseModel
from typing import List


class MealSuggestion(BaseModel):
    title: str
    description: str
    ingredients: List[str]
    instructions: List[str]
    nutrition_notes: str
    encouragement: str


class Affirmation(BaseModel):
    text: str
    category: str
    encouragement: str
