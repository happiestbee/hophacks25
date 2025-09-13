from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, asc
from typing import List, Optional
from datetime import date, datetime, timedelta

from app.core.database import get_db
from app.models.daily_tracking import DailyTracking
from app.schemas.daily_tracking import (
    DailyTrackingCreate,
    DailyTrackingUpdate,
    DailyTrackingResponse,
    DailyTrackingSummary,
    WeeklyTrackingSummary,
    CalorieUpdateRequest,
    TemperatureUpdateRequest
)

router = APIRouter(prefix="/api/daily-tracking", tags=["daily-tracking"])


@router.post("/", response_model=DailyTrackingResponse)
def create_daily_tracking(
    tracking_data: DailyTrackingCreate,
    user_id: str = Query(..., description="User identifier"),
    db: Session = Depends(get_db)
):
    """Create a new daily tracking entry for a user"""
    
    # Check if entry already exists for this user and date
    existing_entry = db.query(DailyTracking).filter(
        and_(
            DailyTracking.user_id == user_id,
            DailyTracking.tracking_date == tracking_data.tracking_date
        )
    ).first()
    
    if existing_entry:
        raise HTTPException(
            status_code=400,
            detail=f"Daily tracking entry already exists for {tracking_data.tracking_date}"
        )
    
    # Create new tracking entry
    db_tracking = DailyTracking(
        user_id=user_id,
        **tracking_data.dict()
    )
    
    db.add(db_tracking)
    db.commit()
    db.refresh(db_tracking)
    
    return _add_computed_properties(db_tracking)


@router.get("/", response_model=List[DailyTrackingResponse])
def get_daily_tracking_entries(
    user_id: str = Query(..., description="User identifier"),
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    limit: int = Query(30, ge=1, le=365, description="Maximum number of entries to return"),
    db: Session = Depends(get_db)
):
    """Get daily tracking entries for a user with optional date filtering"""
    
    query = db.query(DailyTracking).filter(DailyTracking.user_id == user_id)
    
    if start_date:
        query = query.filter(DailyTracking.tracking_date >= start_date)
    if end_date:
        query = query.filter(DailyTracking.tracking_date <= end_date)
    
    entries = query.order_by(desc(DailyTracking.tracking_date)).limit(limit).all()
    
    return [_add_computed_properties(entry) for entry in entries]


@router.get("/date/{tracking_date}", response_model=DailyTrackingResponse)
def get_daily_tracking_by_date(
    tracking_date: date,
    user_id: str = Query(..., description="User identifier"),
    db: Session = Depends(get_db)
):
    """Get daily tracking entry for a specific date"""
    
    entry = db.query(DailyTracking).filter(
        and_(
            DailyTracking.user_id == user_id,
            DailyTracking.tracking_date == tracking_date
        )
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=404,
            detail=f"No tracking data found for {tracking_date}"
        )
    
    return _add_computed_properties(entry)


@router.put("/date/{tracking_date}", response_model=DailyTrackingResponse)
def update_daily_tracking(
    tracking_date: date,
    tracking_data: DailyTrackingUpdate,
    user_id: str = Query(..., description="User identifier"),
    db: Session = Depends(get_db)
):
    """Update daily tracking entry for a specific date"""
    
    entry = db.query(DailyTracking).filter(
        and_(
            DailyTracking.user_id == user_id,
            DailyTracking.tracking_date == tracking_date
        )
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=404,
            detail=f"No tracking data found for {tracking_date}"
        )
    
    # Update only provided fields
    update_data = tracking_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)
    
    # Auto-calculate total calories if meal calories are provided
    if any(field.startswith('calories_from_') for field in update_data.keys()):
        meal_calories = [
            entry.calories_from_breakfast or 0,
            entry.calories_from_lunch or 0,
            entry.calories_from_dinner or 0,
            entry.calories_from_snacks or 0
        ]
        if sum(meal_calories) > 0:
            entry.total_calories = sum(meal_calories)
    
    db.commit()
    db.refresh(entry)
    
    return _add_computed_properties(entry)


@router.patch("/date/{tracking_date}/calories", response_model=DailyTrackingResponse)
def update_calories(
    tracking_date: date,
    calorie_data: CalorieUpdateRequest,
    user_id: str = Query(..., description="User identifier"),
    db: Session = Depends(get_db)
):
    """Update just the calorie information for a specific date"""
    
    entry = db.query(DailyTracking).filter(
        and_(
            DailyTracking.user_id == user_id,
            DailyTracking.tracking_date == tracking_date
        )
    ).first()
    
    if not entry:
        # Create new entry if it doesn't exist
        entry = DailyTracking(
            user_id=user_id,
            tracking_date=tracking_date,
            target_calories=2500
        )
        db.add(entry)
    
    # Update calorie fields
    update_data = calorie_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)
    
    # Auto-calculate total if not provided but meal calories are
    if 'total_calories' not in update_data:
        meal_calories = [
            entry.calories_from_breakfast or 0,
            entry.calories_from_lunch or 0,
            entry.calories_from_dinner or 0,
            entry.calories_from_snacks or 0
        ]
        if sum(meal_calories) > 0:
            entry.total_calories = sum(meal_calories)
    
    db.commit()
    db.refresh(entry)
    
    return _add_computed_properties(entry)


@router.patch("/date/{tracking_date}/temperature", response_model=DailyTrackingResponse)
def update_temperature(
    tracking_date: date,
    temp_data: TemperatureUpdateRequest,
    user_id: str = Query(..., description="User identifier"),
    db: Session = Depends(get_db)
):
    """Update just the temperature information for a specific date"""
    
    entry = db.query(DailyTracking).filter(
        and_(
            DailyTracking.user_id == user_id,
            DailyTracking.tracking_date == tracking_date
        )
    ).first()
    
    if not entry:
        # Create new entry if it doesn't exist
        entry = DailyTracking(
            user_id=user_id,
            tracking_date=tracking_date,
            target_calories=2500
        )
        db.add(entry)
    
    # Update temperature fields
    update_data = temp_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)
    
    db.commit()
    db.refresh(entry)
    
    return _add_computed_properties(entry)


@router.get("/summary", response_model=List[DailyTrackingSummary])
def get_daily_summaries(
    user_id: str = Query(..., description="User identifier"),
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    limit: int = Query(30, ge=1, le=365, description="Maximum number of summaries to return"),
    db: Session = Depends(get_db)
):
    """Get daily tracking summaries for a user"""
    
    query = db.query(DailyTracking).filter(DailyTracking.user_id == user_id)
    
    if start_date:
        query = query.filter(DailyTracking.tracking_date >= start_date)
    if end_date:
        query = query.filter(DailyTracking.tracking_date <= end_date)
    
    entries = query.order_by(desc(DailyTracking.tracking_date)).limit(limit).all()
    
    summaries = []
    for entry in entries:
        summary = DailyTrackingSummary(
            user_id=entry.user_id,
            tracking_date=entry.tracking_date,
            total_calories=entry.total_calories,
            target_calories=entry.target_calories,
            calorie_progress_percentage=entry.calorie_progress_percentage,
            remaining_calories=entry.remaining_calories,
            energy_level=entry.energy_level,
            mood_rating=entry.mood_rating,
            morning_temp=entry.morning_temp,
            is_complete=entry.is_complete
        )
        summaries.append(summary)
    
    return summaries


@router.get("/weekly-summary", response_model=WeeklyTrackingSummary)
def get_weekly_summary(
    user_id: str = Query(..., description="User identifier"),
    week_start: date = Query(..., description="Start date of the week (Monday)"),
    db: Session = Depends(get_db)
):
    """Get weekly tracking summary for a user"""
    
    week_end = week_start + timedelta(days=6)
    
    entries = db.query(DailyTracking).filter(
        and_(
            DailyTracking.user_id == user_id,
            DailyTracking.tracking_date >= week_start,
            DailyTracking.tracking_date <= week_end
        )
    ).order_by(asc(DailyTracking.tracking_date)).all()
    
    # Create daily summaries
    daily_summaries = []
    for entry in entries:
        summary = DailyTrackingSummary(
            user_id=entry.user_id,
            tracking_date=entry.tracking_date,
            total_calories=entry.total_calories,
            target_calories=entry.target_calories,
            calorie_progress_percentage=entry.calorie_progress_percentage,
            remaining_calories=entry.remaining_calories,
            energy_level=entry.energy_level,
            mood_rating=entry.mood_rating,
            morning_temp=entry.morning_temp,
            is_complete=entry.is_complete
        )
        daily_summaries.append(summary)
    
    # Calculate averages
    calories = [e.total_calories for e in entries if e.total_calories is not None]
    energy_levels = [e.energy_level for e in entries if e.energy_level is not None]
    mood_ratings = [e.mood_rating for e in entries if e.mood_rating is not None]
    morning_temps = [e.morning_temp for e in entries if e.morning_temp is not None]
    
    return WeeklyTrackingSummary(
        user_id=user_id,
        week_start_date=week_start,
        week_end_date=week_end,
        daily_summaries=daily_summaries,
        average_calories=sum(calories) / len(calories) if calories else None,
        average_energy=sum(energy_levels) / len(energy_levels) if energy_levels else None,
        average_mood=sum(mood_ratings) / len(mood_ratings) if mood_ratings else None,
        average_morning_temp=sum(morning_temps) / len(morning_temps) if morning_temps else None,
        days_with_complete_data=len([e for e in entries if e.is_complete]),
        total_days=len(entries)
    )


@router.delete("/date/{tracking_date}")
def delete_daily_tracking(
    tracking_date: date,
    user_id: str = Query(..., description="User identifier"),
    db: Session = Depends(get_db)
):
    """Delete daily tracking entry for a specific date"""
    
    entry = db.query(DailyTracking).filter(
        and_(
            DailyTracking.user_id == user_id,
            DailyTracking.tracking_date == tracking_date
        )
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=404,
            detail=f"No tracking data found for {tracking_date}"
        )
    
    db.delete(entry)
    db.commit()
    
    return {"message": f"Daily tracking data for {tracking_date} deleted successfully"}


@router.get("/today", response_model=DailyTrackingResponse)
def get_today_tracking(
    user_id: str = Query(..., description="User identifier"),
    db: Session = Depends(get_db)
):
    """Get today's tracking entry for a user"""
    
    today = date.today()
    entry = db.query(DailyTracking).filter(
        and_(
            DailyTracking.user_id == user_id,
            DailyTracking.tracking_date == today
        )
    ).first()
    
    if not entry:
        # Create a new entry for today with default values
        entry = DailyTracking(
            user_id=user_id,
            tracking_date=today,
            target_calories=2500
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
    
    return _add_computed_properties(entry)


@router.get("/admin/all-tracking")
def get_all_tracking_data(db: Session = Depends(get_db)):
    """Get all daily tracking data for database viewing (admin endpoint)"""
    
    entries = db.query(DailyTracking).order_by(desc(DailyTracking.tracking_date), desc(DailyTracking.user_id)).all()
    
    return {
        "total_entries": len(entries),
        "entries": [
            {
                "id": entry.id,
                "user_id": entry.user_id,
                "tracking_date": entry.tracking_date.isoformat(),
                "total_calories": entry.total_calories,
                "target_calories": entry.target_calories,
                "calories_from_breakfast": entry.calories_from_breakfast,
                "calories_from_lunch": entry.calories_from_lunch,
                "calories_from_dinner": entry.calories_from_dinner,
                "calories_from_snacks": entry.calories_from_snacks,
                "morning_temp": entry.morning_temp,
                "evening_temp": entry.evening_temp,
                "energy_level": entry.energy_level,
                "mood_rating": entry.mood_rating,
                "sleep_hours": entry.sleep_hours,
                "exercise_minutes": entry.exercise_minutes,
                "water_glasses": entry.water_glasses,
                "stress_level": entry.stress_level,
                "is_complete": entry.is_complete,
                "calorie_progress_percentage": entry.calorie_progress_percentage,
                "remaining_calories": entry.remaining_calories,
                "created_at": entry.created_at,
                "updated_at": entry.updated_at
            }
            for entry in entries
        ]
    }


@router.delete("/admin/clear-tracking")
def clear_all_tracking_data(db: Session = Depends(get_db)):
    """Clear all daily tracking data from database (admin endpoint)"""
    
    # Get count before deletion for response
    entry_count = db.query(DailyTracking).count()
    
    # Delete all tracking entries
    db.query(DailyTracking).delete()
    db.commit()
    
    return {
        "message": "Daily tracking database cleared successfully",
        "entries_deleted": entry_count
    }


def _add_computed_properties(entry: DailyTracking) -> DailyTrackingResponse:
    """Add computed properties to a DailyTracking entry"""
    entry_dict = {
        "id": entry.id,
        "user_id": entry.user_id,
        "tracking_date": entry.tracking_date,
        "morning_temp": entry.morning_temp,
        "evening_temp": entry.evening_temp,
        "temp_notes": entry.temp_notes,
        "total_calories": entry.total_calories,
        "target_calories": entry.target_calories,
        "calories_from_breakfast": entry.calories_from_breakfast,
        "calories_from_lunch": entry.calories_from_lunch,
        "calories_from_dinner": entry.calories_from_dinner,
        "calories_from_snacks": entry.calories_from_snacks,
        "energy_level": entry.energy_level,
        "mood_rating": entry.mood_rating,
        "sleep_hours": entry.sleep_hours,
        "sleep_quality": entry.sleep_quality,
        "menstrual_flow": entry.menstrual_flow,
        "cramps_severity": entry.cramps_severity,
        "bloating": entry.bloating,
        "headaches": entry.headaches,
        "breast_tenderness": entry.breast_tenderness,
        "exercise_minutes": entry.exercise_minutes,
        "exercise_type": entry.exercise_type,
        "steps_count": entry.steps_count,
        "water_glasses": entry.water_glasses,
        "stress_level": entry.stress_level,
        "anxiety_level": entry.anxiety_level,
        "medications_taken": entry.medications_taken,
        "supplements_taken": entry.supplements_taken,
        "daily_notes": entry.daily_notes,
        "is_complete": entry.is_complete,
        "created_at": entry.created_at,
        "updated_at": entry.updated_at,
        "calorie_progress_percentage": entry.calorie_progress_percentage,
        "remaining_calories": entry.remaining_calories
    }
    
    return DailyTrackingResponse(**entry_dict)
