from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.lstm_prediction import LSTMPredictionRequest, LSTMPredictionResponse
from app.core.lstm_predictor import LSTMPredictor
from app.core.database import get_db
from app.models.daily_tracking import DailyTracking
from datetime import datetime, timedelta
from typing import List

router = APIRouter(prefix="/api/lstm-prediction", tags=["lstm-prediction"])

# Initialize LSTM predictor
try:
    lstm_predictor = LSTMPredictor()
    if lstm_predictor.is_available():
        print("✅ LSTM predictor initialized successfully")
    else:
        print("❌ LSTM predictor initialization failed - model files missing")
        lstm_predictor = None
except Exception as e:
    print(f"❌ Error initializing LSTM predictor: {e}")
    lstm_predictor = None

@router.post("/predict", response_model=LSTMPredictionResponse)
async def predict_recovery(request: LSTMPredictionRequest, db: Session = Depends(get_db)):
    """
    Predict 30-day period recovery probability using LSTM model
    """
    if not lstm_predictor or not lstm_predictor.is_available():
        raise HTTPException(
            status_code=503,
            detail="LSTM prediction service is not available. Model files may be missing."
        )
    
    try:
        # Get the last 60 days of data
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=60)
        
        daily_records = db.query(DailyTracking).filter(
            DailyTracking.user_id == request.user_id,
            DailyTracking.tracking_date >= start_date,
            DailyTracking.tracking_date <= end_date
        ).order_by(DailyTracking.tracking_date.asc()).all()
        
        if len(daily_records) < 60:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient data for LSTM prediction. Need 60 days, have {len(daily_records)} days."
            )
        
        # Prepare data for LSTM model using actual DailyTracking schema fields
        daily_data = []
        for record in daily_records:
            # Use actual calorie deficit from database or default to 0
            calorie_deficit = record.calorie_deficit or 0
            
            # Use actual HRV from database or estimate based on calorie deficit
            if record.heart_rate_variability is not None:
                hrv_avg = record.heart_rate_variability
            else:
                # Estimate HRV: lower deficits = higher HRV (less stress)
                hrv_avg = max(30, 50 - (abs(calorie_deficit) / 50))  # Range 30-50ms
            
            # Use actual body temperature from database or default
            body_temp = record.body_temperature or 98.6
            
            daily_data.append({
                'calorie_deficit': calorie_deficit,
                'hrv_avg': hrv_avg,
                'body_temperature': body_temp
            })
        
        # Prepare sequence for LSTM
        sequence_data = lstm_predictor.prepare_sequence_from_daily_data(daily_data)
        
        # Make prediction
        recovery_probability = lstm_predictor.predict_recovery_probability(sequence_data)
        
        # Determine confidence level
        if recovery_probability >= 0.8:
            confidence_level = "very_high"
            interpretation = "Very high likelihood of period recovery within 30 days. Your health metrics show excellent recovery trends."
        elif recovery_probability >= 0.6:
            confidence_level = "high"
            interpretation = "High likelihood of period recovery within 30 days. Your body shows strong signs of healing."
        elif recovery_probability >= 0.4:
            confidence_level = "moderate"
            interpretation = "Moderate likelihood of period recovery within 30 days. Continue focusing on gentle nutrition and self-care."
        elif recovery_probability >= 0.2:
            confidence_level = "low"
            interpretation = "Lower likelihood of recovery within 30 days, but progress is being made. Be patient with your healing journey."
        else:
            confidence_level = "very_low"
            interpretation = "Early stages of recovery. Focus on consistent nourishment and stress reduction for optimal healing."
        
        return LSTMPredictionResponse(
            user_id=request.user_id,
            recovery_probability=recovery_probability,
            confidence_level=confidence_level,
            days_of_data_used=len(daily_records),
            prediction_date=datetime.now().date().isoformat(),
            interpretation=interpretation
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in LSTM prediction: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating LSTM prediction: {str(e)}"
        )

@router.get("/status")
async def get_lstm_status():
    """Get the status of the LSTM prediction service"""
    return {
        "available": lstm_predictor is not None and lstm_predictor.is_available(),
        "model_loaded": lstm_predictor.model is not None if lstm_predictor else False,
        "normalization_loaded": lstm_predictor.norm_mean is not None if lstm_predictor else False
    }
