from fastapi import APIRouter
from datetime import datetime, timedelta
from app.schemas.bbt import BBTReading, BBTResponse

router = APIRouter()

# Mock data for demonstration
mock_bbt_data = [
    BBTReading(
        id=i,
        date=(datetime.now() - timedelta(days=30 - i)).date(),
        temperature=97.0 + (i * 0.1) + (0.5 if i % 7 == 0 else 0),
        notes=f"Reading {i+1}" if i % 5 == 0 else None,
    )
    for i in range(30)
]


@router.get("/", response_model=BBTResponse)
async def get_bbt_readings():
    """Get BBT readings for the last 30 days"""
    return BBTResponse(
        readings=mock_bbt_data,
        average_temp=sum(r.temperature for r in mock_bbt_data)
        / len(mock_bbt_data),
        cycle_length=28,  # Mock cycle length
        fertile_window_start=14,  # Mock fertile window
        fertile_window_end=18,
    )


@router.post("/", response_model=BBTReading)
async def create_bbt_reading(reading: BBTReading):
    """Create a new BBT reading"""
    # For demo purposes, just return the reading with an ID
    reading.id = len(mock_bbt_data) + 1
    mock_bbt_data.append(reading)
    return reading
