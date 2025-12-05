from fastapi import APIRouter, Depends
from typing import List
from models.nutrition import HistoryDay
from config.database import daily_records_collection
from dependencies import get_current_user_email

router = APIRouter()

@router.get("/", response_model=List[HistoryDay])
async def get_history(user_email: str = Depends(get_current_user_email)):
    cursor = daily_records_collection.find({"user_email": user_email}).sort("date", -1).limit(7)
    history = []
    for day in cursor:
        history.append(HistoryDay(
            date=day["date"], # Ahora será YYYY-MM-DD, que es ordenable
            calories=day["calories"],
            target=day["target"],
            status=day["status"]
        ))
    return history