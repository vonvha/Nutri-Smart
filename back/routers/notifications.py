from fastapi import APIRouter, Depends
from typing import List
from models.nutrition import Notification
from config.database import notifications_collection
from dependencies import get_current_user_email

router = APIRouter()

@router.get("/", response_model=List[Notification])
async def get_notifications(user_email: str = Depends(get_current_user_email)):
    cursor = notifications_collection.find({"user_email": user_email})
    notifs = []
    for n in cursor:
        notifs.append(Notification(
            id=n["id"],
            type=n["type"],
            title=n["title"],
            time=n["time"],
            description=n["description"],
            isRead=n["isRead"]
        ))
    return notifs