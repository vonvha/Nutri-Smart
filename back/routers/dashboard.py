from fastapi import APIRouter, Depends
from pydantic import BaseModel
from config.database import profiles_collection, daily_records_collection
from dependencies import get_current_user_email
from datetime import datetime

router = APIRouter()

class MacroDetail(BaseModel):
    current: int
    target: int

class Macros(BaseModel):
    protein: MacroDetail
    carbs: MacroDetail
    fat: MacroDetail

class DashboardData(BaseModel):
    caloriesTarget: int
    caloriesConsumed: int
    macros: Macros

@router.get("/", response_model=DashboardData)
async def get_dashboard_data(user_email: str = Depends(get_current_user_email)):
    # 1. Obtener Perfil
    profile = profiles_collection.find_one({"user_email": user_email})
    
    target_kcal = 1800
    target_protein = 140
    target_carbs = 180
    target_fat = 60
    
    if profile:
        target_kcal = profile.get("caloriesTarget", 1800)
        macros = profile.get("macros", {})
        target_protein = macros.get("protein", 140)
        target_carbs = macros.get("carbs", 180)
        target_fat = macros.get("fat", 60)

    # 2. Obtener Consumo de Hoy
    # Usamos el mismo formato estandarizado YYYY-MM-DD
    today_str = datetime.now().date().isoformat()
    daily = daily_records_collection.find_one({"user_email": user_email, "date": today_str})
    
    consumed_kcal = daily["calories"] if daily else 0
    
    # Cálculo simple de progreso de macros basado en el % de calorías consumidas
    ratio = consumed_kcal / target_kcal if target_kcal > 0 else 0
    
    return DashboardData(
        caloriesTarget=target_kcal,
        caloriesConsumed=consumed_kcal,
        macros=Macros(
            protein=MacroDetail(current=int(target_protein * ratio), target=target_protein),
            carbs=MacroDetail(current=int(target_carbs * ratio), target=target_carbs),
            fat=MacroDetail(current=int(target_fat * ratio), target=target_fat)
        )
    )