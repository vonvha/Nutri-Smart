from fastapi import APIRouter, Depends
from typing import Optional
from models.nutrition import Appointment
from config.database import consultations_collection
from dependencies import get_current_user_email

router = APIRouter()

@router.get("/", response_model=Optional[Appointment])
async def get_next_appointment(user_email: str = Depends(get_current_user_email)):
    cita = consultations_collection.find_one(
        {"user_email": user_email},
        sort=[("_id", -1)]
    )
    if cita:
        return Appointment(date=cita["date"], time=cita["time"], type=cita["type"])
    return None

@router.post("/", response_model=Appointment)
async def schedule_appointment(appointment: Appointment, user_email: str = Depends(get_current_user_email)):
    consultations_collection.insert_one({
        "user_email": user_email,
        "date": appointment.date,
        "time": appointment.time,
        "type": appointment.type,
        "status": "scheduled"
    })
    return appointment