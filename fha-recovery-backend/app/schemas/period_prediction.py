from pydantic import BaseModel, Field
from typing import List
from datetime import date


class PeriodPredictionRequest(BaseModel):
    """Schema for period recovery prediction request"""
    user_id: str = Field(..., description="User identifier")
    hrv_average: float = Field(..., ge=0.0, le=200.0, description="Heart rate variability average in milliseconds")
    mean_cycle_duration: float = Field(..., ge=20.0, le=60.0, description="Mean cycle duration in days")
    days_since_last_period: int = Field(..., ge=0, le=1000, description="Days since last menstrual period")


class PeriodPredictionResponse(BaseModel):
    """Schema for period recovery prediction response"""
    user_id: str
    prediction_date: date
    days_since_last_period: int
    hrv_average: float
    mean_cycle_duration: float
    probability_distribution: List[float] = Field(..., description="90-day probability distribution for period recovery")
    peak_probability_day: int = Field(..., description="Day with highest recovery probability (1-90)")
    peak_probability_value: float = Field(..., description="Highest probability value")
    cumulative_30_day_probability: float = Field(..., description="Cumulative probability of recovery within 30 days")
    cumulative_60_day_probability: float = Field(..., description="Cumulative probability of recovery within 60 days")
    cumulative_90_day_probability: float = Field(..., description="Cumulative probability of recovery within 90 days")
    
    class Config:
        json_encoders = {
            date: lambda v: v.isoformat()
        }
