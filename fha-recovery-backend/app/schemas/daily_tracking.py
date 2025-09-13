from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date, datetime
from enum import Enum


class MenstrualFlow(str, Enum):
    none = "none"
    light = "light"
    moderate = "moderate"
    heavy = "heavy"


class DailyTrackingBase(BaseModel):
    tracking_date: date = Field(..., description="Date for this tracking entry")
    
    # Body Temperature
    morning_temp: Optional[float] = Field(None, ge=95.0, le=105.0, description="Morning basal body temperature in °F")
    evening_temp: Optional[float] = Field(None, ge=95.0, le=105.0, description="Evening temperature in °F")
    temp_notes: Optional[str] = Field(None, max_length=500, description="Notes about temperature readings")
    
    # Caloric Intake
    total_calories: Optional[int] = Field(None, ge=0, le=10000, description="Total calories consumed for the day")
    target_calories: int = Field(2500, ge=1000, le=5000, description="Daily calorie target")
    calories_from_breakfast: Optional[int] = Field(None, ge=0, le=3000)
    calories_from_lunch: Optional[int] = Field(None, ge=0, le=3000)
    calories_from_dinner: Optional[int] = Field(None, ge=0, le=3000)
    calories_from_snacks: Optional[int] = Field(None, ge=0, le=2000)
    
    # Energy and Mood
    energy_level: Optional[int] = Field(None, ge=1, le=10, description="Energy level on 1-10 scale")
    mood_rating: Optional[int] = Field(None, ge=1, le=10, description="Mood rating on 1-10 scale")
    sleep_hours: Optional[float] = Field(None, ge=0, le=24, description="Hours of sleep")
    sleep_quality: Optional[int] = Field(None, ge=1, le=10, description="Sleep quality on 1-10 scale")
    
    # Physical Symptoms
    menstrual_flow: Optional[MenstrualFlow] = Field(None, description="Menstrual flow level")
    cramps_severity: Optional[int] = Field(None, ge=1, le=10, description="Cramps severity on 1-10 scale")
    bloating: Optional[bool] = Field(None, description="Experiencing bloating")
    headaches: Optional[bool] = Field(None, description="Experiencing headaches")
    breast_tenderness: Optional[bool] = Field(None, description="Experiencing breast tenderness")
    
    # Exercise and Activity
    exercise_minutes: Optional[int] = Field(None, ge=0, le=600, description="Minutes of exercise")
    exercise_type: Optional[str] = Field(None, max_length=100, description="Type of exercise")
    steps_count: Optional[int] = Field(None, ge=0, le=50000, description="Daily step count")
    
    # Hydration
    water_glasses: Optional[int] = Field(None, ge=0, le=20, description="Number of glasses of water")
    
    # Stress and Mental Health
    stress_level: Optional[int] = Field(None, ge=1, le=10, description="Stress level on 1-10 scale")
    anxiety_level: Optional[int] = Field(None, ge=1, le=10, description="Anxiety level on 1-10 scale")
    
    # Medication and Supplements
    medications_taken: Optional[bool] = Field(None, description="Did they take prescribed medications")
    supplements_taken: Optional[bool] = Field(None, description="Did they take supplements")
    
    # General Notes
    daily_notes: Optional[str] = Field(None, max_length=1000, description="Free-form notes for the day")
    
    # Data Completion
    is_complete: bool = Field(False, description="Is this day's data complete")

    @validator('total_calories')
    def validate_total_calories(cls, v, values):
        """Ensure total calories matches sum of meal calories if provided"""
        if v is not None:
            meal_calories = [
                values.get('calories_from_breakfast', 0) or 0,
                values.get('calories_from_lunch', 0) or 0,
                values.get('calories_from_dinner', 0) or 0,
                values.get('calories_from_snacks', 0) or 0
            ]
            calculated_total = sum(meal_calories)
            if calculated_total > 0 and abs(v - calculated_total) > 100:
                raise ValueError('Total calories should approximately match sum of meal calories')
        return v


class DailyTrackingCreate(DailyTrackingBase):
    """Schema for creating a new daily tracking entry"""
    pass


class DailyTrackingUpdate(BaseModel):
    """Schema for updating an existing daily tracking entry"""
    tracking_date: Optional[date] = None
    
    # Body Temperature
    morning_temp: Optional[float] = Field(None, ge=95.0, le=105.0)
    evening_temp: Optional[float] = Field(None, ge=95.0, le=105.0)
    temp_notes: Optional[str] = Field(None, max_length=500)
    
    # Caloric Intake
    total_calories: Optional[int] = Field(None, ge=0, le=10000)
    target_calories: Optional[int] = Field(None, ge=1000, le=5000)
    calories_from_breakfast: Optional[int] = Field(None, ge=0, le=3000)
    calories_from_lunch: Optional[int] = Field(None, ge=0, le=3000)
    calories_from_dinner: Optional[int] = Field(None, ge=0, le=3000)
    calories_from_snacks: Optional[int] = Field(None, ge=0, le=2000)
    
    # Energy and Mood
    energy_level: Optional[int] = Field(None, ge=1, le=10)
    mood_rating: Optional[int] = Field(None, ge=1, le=10)
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    
    # Physical Symptoms
    menstrual_flow: Optional[MenstrualFlow] = None
    cramps_severity: Optional[int] = Field(None, ge=1, le=10)
    bloating: Optional[bool] = None
    headaches: Optional[bool] = None
    breast_tenderness: Optional[bool] = None
    
    # Exercise and Activity
    exercise_minutes: Optional[int] = Field(None, ge=0, le=600)
    exercise_type: Optional[str] = Field(None, max_length=100)
    steps_count: Optional[int] = Field(None, ge=0, le=50000)
    
    # Hydration
    water_glasses: Optional[int] = Field(None, ge=0, le=20)
    
    # Stress and Mental Health
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    anxiety_level: Optional[int] = Field(None, ge=1, le=10)
    
    # Medication and Supplements
    medications_taken: Optional[bool] = None
    supplements_taken: Optional[bool] = None
    
    # General Notes
    daily_notes: Optional[str] = Field(None, max_length=1000)
    
    # Data Completion
    is_complete: Optional[bool] = None


class DailyTrackingResponse(DailyTrackingBase):
    """Schema for daily tracking response"""
    id: int
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]
    
    # Computed properties
    calorie_progress_percentage: float = Field(..., description="Percentage of calorie target achieved")
    remaining_calories: int = Field(..., description="Remaining calories to reach target")
    
    class Config:
        from_attributes = True


class DailyTrackingSummary(BaseModel):
    """Schema for daily tracking summary/overview"""
    user_id: str
    tracking_date: date
    total_calories: Optional[int]
    target_calories: int
    calorie_progress_percentage: float
    remaining_calories: int
    energy_level: Optional[int]
    mood_rating: Optional[int]
    morning_temp: Optional[float]
    is_complete: bool
    
    class Config:
        from_attributes = True


class WeeklyTrackingSummary(BaseModel):
    """Schema for weekly tracking summary"""
    user_id: str
    week_start_date: date
    week_end_date: date
    daily_summaries: list[DailyTrackingSummary]
    average_calories: Optional[float]
    average_energy: Optional[float]
    average_mood: Optional[float]
    average_morning_temp: Optional[float]
    days_with_complete_data: int
    total_days: int
    
    class Config:
        from_attributes = True


class CalorieUpdateRequest(BaseModel):
    """Schema for updating just calorie information"""
    calories_from_breakfast: Optional[int] = Field(None, ge=0, le=3000)
    calories_from_lunch: Optional[int] = Field(None, ge=0, le=3000)
    calories_from_dinner: Optional[int] = Field(None, ge=0, le=3000)
    calories_from_snacks: Optional[int] = Field(None, ge=0, le=2000)
    total_calories: Optional[int] = Field(None, ge=0, le=10000)


class TemperatureUpdateRequest(BaseModel):
    """Schema for updating just temperature information"""
    morning_temp: Optional[float] = Field(None, ge=95.0, le=105.0)
    evening_temp: Optional[float] = Field(None, ge=95.0, le=105.0)
    temp_notes: Optional[str] = Field(None, max_length=500)
