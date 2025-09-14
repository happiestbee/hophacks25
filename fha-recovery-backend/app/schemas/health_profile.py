from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class HealthProfileBase(BaseModel):
    """Base schema for health profile data"""
    days_since_last_period: Optional[int] = Field(None, ge=0, le=3650, description="Days since last menstrual period")
    allergies: Optional[str] = Field(None, description="Food allergies and sensitivities")
    dietary_restrictions: Optional[str] = Field(None, description="Dietary restrictions")
    current_medications: Optional[str] = Field(None, description="Current medications")
    current_supplements: Optional[str] = Field(None, description="Current supplements")
    primary_wellness_goal: Optional[str] = Field(None, description="Primary wellness goal")


class HealthProfileCreate(HealthProfileBase):
    """Schema for creating a health profile"""
    user_id: str = Field(..., description="User identifier")


class HealthProfileUpdate(HealthProfileBase):
    """Schema for updating a health profile"""
    survey_completed: Optional[bool] = Field(None, description="Survey completion status")


class HealthProfileResponse(HealthProfileBase):
    """Schema for health profile response"""
    id: int
    user_id: str
    survey_completed: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SurveyStepUpdate(BaseModel):
    """Schema for updating individual survey steps"""
    step: str = Field(..., description="Survey step identifier")
    data: dict = Field(..., description="Step data")


class SurveyCompletionRequest(BaseModel):
    """Schema for completing the survey"""
    user_id: str = Field(..., description="User identifier")
    days_since_last_period: Optional[int] = Field(None, ge=0, le=3650, description="Days since last menstrual period")
    allergies: Optional[str] = None
    dietary_restrictions: Optional[str] = None
    current_medications: Optional[str] = None
    current_supplements: Optional[str] = None
    primary_wellness_goal: Optional[str] = None
