from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, date
from app.core.database import Base


class DailyTracking(Base):
    __tablename__ = "daily_tracking"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)  # Foreign key to user identifier
    tracking_date = Column(Date, nullable=False, index=True)  # Date for this tracking entry
    
    # Body Temperature Tracking
    morning_temp = Column(Float, nullable=True)  # Morning basal body temperature (°F)
    evening_temp = Column(Float, nullable=True)  # Evening temperature (°F)
    temp_notes = Column(Text, nullable=True)  # Notes about temperature readings
    
    # Caloric Intake Tracking
    total_calories = Column(Integer, nullable=True)  # Total calories consumed for the day
    target_calories = Column(Integer, default=2500, nullable=False)  # Daily calorie target
    calories_from_breakfast = Column(Integer, nullable=True)
    calories_from_lunch = Column(Integer, nullable=True)
    calories_from_dinner = Column(Integer, nullable=True)
    calories_from_snacks = Column(Integer, nullable=True)
    
    # Energy and Mood Tracking
    energy_level = Column(Integer, nullable=True)  # 1-10 scale
    mood_rating = Column(Integer, nullable=True)  # 1-10 scale
    sleep_hours = Column(Float, nullable=True)  # Hours of sleep
    sleep_quality = Column(Integer, nullable=True)  # 1-10 scale
    
    # Physical Symptoms
    menstrual_flow = Column(String, nullable=True)  # none, light, moderate, heavy
    cramps_severity = Column(Integer, nullable=True)  # 1-10 scale
    bloating = Column(Boolean, nullable=True)
    headaches = Column(Boolean, nullable=True)
    breast_tenderness = Column(Boolean, nullable=True)
    
    # Exercise and Activity
    exercise_minutes = Column(Integer, nullable=True)  # Minutes of exercise
    exercise_type = Column(String, nullable=True)  # Type of exercise
    steps_count = Column(Integer, nullable=True)  # Daily step count
    
    # Hydration
    water_glasses = Column(Integer, nullable=True)  # Number of glasses of water
    
    # Stress and Mental Health
    stress_level = Column(Integer, nullable=True)  # 1-10 scale
    anxiety_level = Column(Integer, nullable=True)  # 1-10 scale
    
    # Medication and Supplements
    medications_taken = Column(Boolean, default=True, nullable=True)  # Did they take prescribed meds
    supplements_taken = Column(Boolean, default=True, nullable=True)  # Did they take supplements
    
    # General Notes
    daily_notes = Column(Text, nullable=True)  # Free-form notes for the day
    
    # Data Completion Status
    is_complete = Column(Boolean, default=False, nullable=False)  # Is this day's data complete
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<DailyTracking(user_id={self.user_id}, date={self.tracking_date}, calories={self.total_calories})>"
    
    @property
    def calorie_progress_percentage(self):
        """Calculate percentage of calorie target achieved"""
        if self.total_calories and self.target_calories:
            return min(100, (self.total_calories / self.target_calories) * 100)
        return 0
    
    @property
    def remaining_calories(self):
        """Calculate remaining calories to reach target"""
        if self.total_calories and self.target_calories:
            return max(0, self.target_calories - self.total_calories)
        return self.target_calories or 2500
