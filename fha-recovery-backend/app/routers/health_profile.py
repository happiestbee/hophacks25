from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.health_profile import HealthProfile
from app.schemas.health_profile import (
    HealthProfileCreate,
    HealthProfileUpdate,
    HealthProfileResponse,
    SurveyCompletionRequest
)

router = APIRouter()


@router.post("/", response_model=HealthProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_health_profile(
    profile_data: HealthProfileCreate,
    db: Session = Depends(get_db)
):
    """Create a new health profile for a user"""
    
    # Check if profile already exists for this user
    existing_profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == profile_data.user_id
    ).first()
    
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Health profile already exists for this user"
        )
    
    # Create new health profile
    db_profile = HealthProfile(
        user_id=profile_data.user_id,
        days_since_last_period=profile_data.days_since_last_period,
        allergies=profile_data.allergies,
        dietary_restrictions=profile_data.dietary_restrictions,
        current_medications=profile_data.current_medications,
        current_supplements=profile_data.current_supplements,
        primary_wellness_goal=profile_data.primary_wellness_goal,
        survey_completed=False
    )
    
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    
    return db_profile


@router.get("/{user_id}", response_model=HealthProfileResponse)
async def get_health_profile(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get health profile for a specific user"""
    
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == user_id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health profile not found for this user"
        )
    
    return profile


@router.put("/{user_id}", response_model=HealthProfileResponse)
async def update_health_profile(
    user_id: str,
    profile_data: HealthProfileUpdate,
    db: Session = Depends(get_db)
):
    """Update health profile for a specific user"""
    
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == user_id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health profile not found for this user"
        )
    
    # Update fields that are provided
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    
    return profile


@router.post("/survey/complete", response_model=HealthProfileResponse)
async def complete_survey(
    survey_data: SurveyCompletionRequest,
    db: Session = Depends(get_db)
):
    """Complete the health survey and create/update profile"""
    
    # Check if profile exists
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == survey_data.user_id
    ).first()
    
    if profile:
        # Update existing profile
        profile.days_since_last_period = survey_data.days_since_last_period
        profile.allergies = survey_data.allergies
        profile.dietary_restrictions = survey_data.dietary_restrictions
        profile.current_medications = survey_data.current_medications
        profile.current_supplements = survey_data.current_supplements
        profile.primary_wellness_goal = survey_data.primary_wellness_goal
        profile.survey_completed = True
    else:
        # Create new profile
        profile = HealthProfile(
            user_id=survey_data.user_id,
            days_since_last_period=survey_data.days_since_last_period,
            allergies=survey_data.allergies,
            dietary_restrictions=survey_data.dietary_restrictions,
            current_medications=survey_data.current_medications,
            current_supplements=survey_data.current_supplements,
            primary_wellness_goal=survey_data.primary_wellness_goal,
            survey_completed=True
        )
        db.add(profile)
    
    db.commit()
    db.refresh(profile)
    
    return profile


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_health_profile(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Delete health profile for a specific user"""
    
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == user_id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health profile not found for this user"
        )
    
    db.delete(profile)
    db.commit()
    
    return None


@router.get("/{user_id}/survey-status")
async def get_survey_status(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Check if user has completed the health survey"""
    
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == user_id
    ).first()
    
    return {
        "user_id": user_id,
        "survey_completed": profile.survey_completed if profile else False,
        "profile_exists": profile is not None
    }


@router.get("/admin/all-profiles")
async def get_all_profiles(db: Session = Depends(get_db)):
    """Get all health profiles for database viewing (admin endpoint)"""
    
    profiles = db.query(HealthProfile).all()
    
    return {
        "total_profiles": len(profiles),
        "profiles": [
            {
                "id": profile.id,
                "user_id": profile.user_id,
                "survey_completed": profile.survey_completed,
                "days_since_last_period": profile.days_since_last_period,
                "allergies": profile.allergies,
                "dietary_restrictions": profile.dietary_restrictions,
                "current_medications": profile.current_medications,
                "current_supplements": profile.current_supplements,
                "primary_wellness_goal": profile.primary_wellness_goal,
                "created_at": profile.created_at,
                "updated_at": profile.updated_at
            }
            for profile in profiles
        ]
    }


@router.delete("/admin/clear-database", status_code=status.HTTP_200_OK)
async def clear_all_profiles(db: Session = Depends(get_db)):
    """Clear all health profiles and daily tracking data from database (admin endpoint)"""
    
    # Import DailyTracking model
    from app.models.daily_tracking import DailyTracking
    
    # Get counts before deletion for response
    profile_count = db.query(HealthProfile).count()
    tracking_count = db.query(DailyTracking).count()
    
    # Delete all daily tracking data first (due to potential foreign key constraints)
    db.query(DailyTracking).delete()
    
    # Delete all health profiles
    db.query(HealthProfile).delete()
    
    db.commit()
    
    return {
        "message": "Database cleared successfully",
        "profiles_deleted": profile_count,
        "tracking_entries_deleted": tracking_count
    }
