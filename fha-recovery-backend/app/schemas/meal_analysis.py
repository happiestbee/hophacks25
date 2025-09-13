from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class MealAnalysisRequest(BaseModel):
    meal_type: str  # breakfast, lunch, dinner, snack
    description: str
    image_base64: Optional[str] = None


class NutrientInfo(BaseModel):
    name: str
    amount: str
    daily_value_percentage: Optional[float] = None
    health_impact: str  # "positive", "neutral", "negative"


class HealthAspect(BaseModel):
    aspect: str
    impact: str  # "positive" or "negative"
    explanation: str
    severity: str  # "low", "moderate", "high"


class MealAnalysisResponse(BaseModel):
    meal_id: str
    overall_score: int  # 1-10 scale
    overall_assessment: str
    key_nutrients: List[NutrientInfo]
    positive_aspects: List[HealthAspect]
    areas_for_improvement: List[HealthAspect]
    nutritional_highlights: str
    encouragement: str
    processing_level: str  # "minimal", "moderate", "highly_processed"
    estimated_calories: Optional[int] = None
