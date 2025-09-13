from pydantic import BaseModel
from datetime import date
from typing import List, Optional


class BBTReading(BaseModel):
    id: Optional[int] = None
    date: date
    temperature: float
    notes: Optional[str] = None


class BBTResponse(BaseModel):
    readings: List[BBTReading]
    average_temp: float
    cycle_length: int
    fertile_window_start: int
    fertile_window_end: int
