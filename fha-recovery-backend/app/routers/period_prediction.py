from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import date
import numpy as np
from typing import List

from app.core.database import get_db
from app.core.coxfinal import predict_period_recovery
from app.schemas.period_prediction import PeriodPredictionRequest, PeriodPredictionResponse
from app.models.daily_tracking import DailyTracking
from app.models.health_profile import HealthProfile

router = APIRouter(prefix="/api/period-prediction", tags=["period-prediction"])


@router.post("/predict", response_model=PeriodPredictionResponse)
def predict_period_recovery_endpoint(
    request: PeriodPredictionRequest,
    db: Session = Depends(get_db)
):
    """
    Predict period recovery probability distribution using Cox regression model.
    
    This endpoint uses the user's HRV data, mean cycle duration, and time since last period
    to generate a 180-day probability distribution for period recovery.
    """
    try:
        # Get the probability distribution from the Cox model
        probability_array = predict_period_recovery(
            userhrv=request.hrv_average,
            usermcd=request.mean_cycle_duration,
            timesinceperiod=request.days_since_last_period
        )
        
        # Convert numpy array to list for JSON serialization
        probability_list = probability_array.tolist()
        
        # Calculate summary statistics
        peak_day = int(np.argmax(probability_array)) + 1  # 1-indexed
        peak_probability = float(np.max(probability_array))
        
        # Calculate cumulative probabilities
        cumulative_30 = float(np.sum(probability_array[:30]))
        cumulative_60 = float(np.sum(probability_array[:60]))
        cumulative_90 = float(np.sum(probability_array[:90]))
        cumulative_180 = float(np.sum(probability_array[:180]))
        
        return PeriodPredictionResponse(
            user_id=request.user_id,
            prediction_date=date.today(),
            days_since_last_period=request.days_since_last_period,
            hrv_average=request.hrv_average,
            mean_cycle_duration=request.mean_cycle_duration,
            probability_distribution=probability_list,
            peak_probability_day=peak_day,
            peak_probability_value=peak_probability,
            cumulative_30_day_probability=cumulative_30,
            cumulative_60_day_probability=cumulative_60,
            cumulative_90_day_probability=cumulative_90
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating period recovery prediction: {str(e)}"
        )


@router.post("/predict-from-data", response_model=PeriodPredictionResponse)
def predict_from_user_data(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Predict period recovery using the user's historical daily tracking data and health profile.
    
    This endpoint automatically calculates HRV average from daily tracking data and
    retrieves days since last period from the user's health profile.
    """
    try:
        # Get user's health profile to retrieve days since last period
        health_profile = db.query(HealthProfile).filter(
            HealthProfile.user_id == user_id
        ).first()
        
        if not health_profile or health_profile.days_since_last_period is None:
            raise HTTPException(
                status_code=404,
                detail="No health profile found or days since last period not set. Please complete your health profile."
            )
        
        # Get user's recent daily tracking data (last 30 days for HRV average)
        recent_entries = db.query(DailyTracking).filter(
            DailyTracking.user_id == user_id,
            DailyTracking.heart_rate_variability.isnot(None)
        ).order_by(DailyTracking.tracking_date.desc()).limit(30).all()
        
        if not recent_entries:
            raise HTTPException(
                status_code=404,
                detail="No HRV data found for user. Please ensure daily tracking data is available."
            )
        
        # Calculate average HRV from recent data
        hrv_values = [entry.heart_rate_variability for entry in recent_entries if entry.heart_rate_variability is not None]
        if not hrv_values:
            raise HTTPException(
                status_code=400,
                detail="No valid HRV data found in recent entries."
            )
        
        avg_hrv = sum(hrv_values) / len(hrv_values)
        
        # Use a default mean cycle duration (can be enhanced later with actual cycle tracking)
        # For FHA users, cycles are often longer or irregular, so we use a higher default
        default_mcd = 35.0  # days
        
        # Create prediction request using data from health profile
        prediction_request = PeriodPredictionRequest(
            user_id=user_id,
            hrv_average=avg_hrv,
            mean_cycle_duration=default_mcd,
            days_since_last_period=health_profile.days_since_last_period
        )
        
        # Generate prediction using the main endpoint logic
        return predict_period_recovery_endpoint(prediction_request, db)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating prediction from user data: {str(e)}"
        )
