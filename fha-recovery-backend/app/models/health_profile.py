from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)  # User identifier
    
    # Cycle History
    last_menstrual_period = Column(Text, nullable=True)  # Flexible text input
    
    # Nutrition & Dietary Information
    allergies = Column(Text, nullable=True)  # Food allergies
    dietary_restrictions = Column(Text, nullable=True)  # Dietary restrictions
    
    # Medications & Supplements
    current_medications = Column(Text, nullable=True)  # Current medications
    current_supplements = Column(Text, nullable=True)  # Current supplements
    
    # Wellness Goals
    primary_wellness_goal = Column(Text, nullable=True)  # Primary wellness goal
    
    # Survey Completion Status
    survey_completed = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<HealthProfile(user_id={self.user_id}, survey_completed={self.survey_completed})>"
