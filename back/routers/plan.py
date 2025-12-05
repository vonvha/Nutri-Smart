from fastapi import APIRouter, Depends
from typing import List
from models.nutrition import Meal
from config.database import profiles_collection
from dependencies import get_current_user_email

router = APIRouter()

MEALS_WEIGHT_LOSS = [
  { "type": "Desayuno", "name": "Avena con proteína", "kcal": 450, "macros": "30P • 50C • 10G" },
  { "type": "Almuerzo", "name": "Pollo a la plancha y arroz", "kcal": 600, "macros": "45P • 60C • 15G" },
  { "type": "Snack", "name": "Manzana y almendras", "kcal": 200, "macros": "5P • 25C • 10G" },
  { "type": "Cena", "name": "Ensalada con atún", "kcal": 350, "macros": "35P • 10C • 15G" },
]

MEALS_MUSCLE = [
  { "type": "Desayuno", "name": "4 Huevos y Pan Integral", "kcal": 600, "macros": "40P • 40C • 20G" },
  { "type": "Almuerzo", "name": "Carne con Pasta", "kcal": 800, "macros": "50P • 90C • 25G" },
  { "type": "Snack", "name": "Batido y Plátano", "kcal": 400, "macros": "30P • 50C • 5G" },
  { "type": "Cena", "name": "Salmón y Papa", "kcal": 600, "macros": "40P • 40C • 20G" },
]

@router.get("/", response_model=List[Meal])
async def get_meal_plan(user_email: str = Depends(get_current_user_email)):
    profile = profiles_collection.find_one({"user_email": user_email})
    
    if profile and profile.get("goal") == "Ganar músculo":
        return MEALS_MUSCLE
        
    return MEALS_WEIGHT_LOSS