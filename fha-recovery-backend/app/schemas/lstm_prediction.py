from pydantic import BaseModel
from typing import Optional

class LSTMPredictionRequest(BaseModel):
    user_id: str

class LSTMPredictionResponse(BaseModel):
    user_id: str
    recovery_probability: float
    confidence_level: str
    days_of_data_used: int
    prediction_date: str
    interpretation: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user@example.com",
                "recovery_probability": 0.75,
                "confidence_level": "high",
                "days_of_data_used": 60,
                "prediction_date": "2025-09-13",
                "interpretation": "High likelihood of period recovery within 30 days based on recent health trends"
            }
        }
