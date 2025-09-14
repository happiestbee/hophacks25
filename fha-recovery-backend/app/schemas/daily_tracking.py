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
    
    # Core BBT and Health Metrics
    body_temperature: Optional[float] = Field(None, ge=95.0, le=105.0, description="Basal body temperature in °F")
    heart_rate_variability: Optional[float] = Field(None, ge=0.0, le=200.0, description="Heart rate variability in milliseconds")
    calorie_deficit: Optional[int] = Field(None, ge=-2000, le=2000, description="Calorie deficit (expenditure - intake)")
    
    # Menstrual Cycle Tracking - Removed for FHA users
    
    # Optional Notes
    daily_notes: Optional[str] = Field(None, max_length=1000, description="Free-form notes for the day")


class DailyTrackingCreate(DailyTrackingBase):
    """Schema for creating a new daily tracking entry"""
    pass


class DailyTrackingUpdate(BaseModel):
    """Schema for updating an existing daily tracking entry"""
    tracking_date: Optional[date] = None
    
    # Core BBT and Health Metrics
    body_temperature: Optional[float] = Field(None, ge=95.0, le=105.0)
    heart_rate_variability: Optional[float] = Field(None, ge=0.0, le=200.0)
    calorie_deficit: Optional[int] = Field(None, ge=-2000, le=2000)
    
    # Optional Notes
    daily_notes: Optional[str] = Field(None, max_length=1000)


class DailyTrackingResponse(DailyTrackingBase):
    """Schema for daily tracking response"""
    id: int
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class DailyTrackingSummary(BaseModel):
    """Schema for daily tracking summary/overview"""
    user_id: str
    tracking_date: date
    body_temperature: Optional[float]
    heart_rate_variability: Optional[float]
    calorie_deficit: Optional[int]
    
    class Config:
        from_attributes = True


class WeeklyTrackingSummary(BaseModel):
    """Schema for weekly tracking summary"""
    user_id: str
    week_start_date: date
    week_end_date: date
    daily_summaries: list[DailyTrackingSummary]
    average_body_temperature: Optional[float]
    average_hrv: Optional[float]
    average_calorie_deficit: Optional[float]
    total_days: int
    
    class Config:
        from_attributes = True


class HealthMetricsUpdateRequest(BaseModel):
    """Schema for updating health metrics"""
    body_temperature: Optional[float] = Field(None, ge=95.0, le=105.0)
    heart_rate_variability: Optional[float] = Field(None, ge=0.0, le=200.0)
    calorie_deficit: Optional[int] = Field(None, ge=-2000, le=2000)
    daily_notes: Optional[str] = Field(None, max_length=1000, description="Free-form notes for the day")
