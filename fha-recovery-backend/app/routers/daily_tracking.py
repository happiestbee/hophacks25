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
    HealthMetricsUpdateRequest
)

router = APIRouter(prefix="/api/daily-tracking", tags=["daily-tracking"])


@router.patch("/date/{tracking_date}/calories", response_model=DailyTrackingResponse)
def update_daily_calories(
    tracking_date: date,
    calories_to_add: int = Query(..., description="Calories to add to today's total"),
    user_id: str = Query(..., description="User identifier"),
    db: Session = Depends(get_db)
):
    """Add calories to today's total calorie intake"""
    
    # Get or create today's tracking entry
    tracking_entry = db.query(DailyTracking).filter(
        and_(
            DailyTracking.user_id == user_id,
            DailyTracking.tracking_date == tracking_date
        )
    ).first()
    
    if not tracking_entry:
        # Create new entry for today
        tracking_entry = DailyTracking(
            user_id=user_id,
            tracking_date=tracking_date,
            total_calories=calories_to_add
        )
        db.add(tracking_entry)
    else:
        # Update existing entry
        current_calories = tracking_entry.total_calories or 0
        tracking_entry.total_calories = current_calories + calories_to_add
    
    db.commit()
    db.refresh(tracking_entry)
    
    return tracking_entry


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
    
    return db_tracking


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
    
    return entries


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
    
    return entry


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
    
    db.commit()
    db.refresh(entry)
    
    return entry


@router.patch("/date/{tracking_date}/health-metrics", response_model=DailyTrackingResponse)
def update_health_metrics(
    tracking_date: date,
    health_data: HealthMetricsUpdateRequest,
    user_id: str = Query(..., description="User identifier"),
    db: Session = Depends(get_db)
):
    """Update health metrics (temperature, HRV, calories expended) for a specific date"""
    
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
            tracking_date=tracking_date
        )
        db.add(entry)
    
    # Update health metric fields
    update_data = health_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)
    
    db.commit()
    db.refresh(entry)
    
    return entry


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
            body_temperature=entry.body_temperature,
            heart_rate_variability=entry.heart_rate_variability,
            calorie_deficit=entry.calorie_deficit
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
            body_temperature=entry.body_temperature,
            heart_rate_variability=entry.heart_rate_variability,
            calorie_deficit=entry.calorie_deficit
        )
        daily_summaries.append(summary)
    
    # Calculate averages
    body_temps = [e.body_temperature for e in entries if e.body_temperature is not None]
    hrv_values = [e.heart_rate_variability for e in entries if e.heart_rate_variability is not None]
    calorie_deficits = [e.calorie_deficit for e in entries if e.calorie_deficit is not None]
    
    return WeeklyTrackingSummary(
        user_id=user_id,
        week_start_date=week_start,
        week_end_date=week_end,
        daily_summaries=daily_summaries,
        average_body_temperature=sum(body_temps) / len(body_temps) if body_temps else None,
        average_hrv=sum(hrv_values) / len(hrv_values) if hrv_values else None,
        average_calorie_deficit=sum(calorie_deficits) / len(calorie_deficits) if calorie_deficits else None,
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
            tracking_date=today
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
    
    return entry


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
                "body_temperature": entry.body_temperature,
                "heart_rate_variability": entry.heart_rate_variability,
                "calorie_deficit": entry.calorie_deficit,
                "daily_notes": entry.daily_notes,
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


