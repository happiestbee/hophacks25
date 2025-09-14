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
    
    # Core BBT and Health Metrics
    body_temperature = Column(Float, nullable=True)  # Basal body temperature (°F)
    heart_rate_variability = Column(Float, nullable=True)  # HRV in milliseconds
    calorie_deficit = Column(Integer, nullable=True)  # Calorie deficit (expenditure - intake)
    
    # Menstrual Cycle Tracking - Removed for FHA users
    
    # Optional Notes
    daily_notes = Column(Text, nullable=True)  # Free-form notes for the day
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<DailyTracking(user_id={self.user_id}, date={self.tracking_date}, temp={self.body_temperature})>"
