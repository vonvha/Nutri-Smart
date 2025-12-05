from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel
from models.nutrition import FoodItem
# AQUI ESTABA EL ERROR: Faltaba importar profiles_collection
from config.database import foods_collection, ingestions_collection, daily_records_collection, profiles_collection
from dependencies import get_current_user_email
from datetime import datetime

router = APIRouter()

@router.get("/recent", response_model=List[FoodItem])
async def get_recent_foods(user_email: str = Depends(get_current_user_email)):
    cursor = ingestions_collection.find({"user_email": user_email}).sort("date", -1).limit(10)
    recent_foods = []
    
    for ing in cursor:
        recent_foods.append(FoodItem(
            id=ing.get("food_id", 0),
            name=ing["food_name"],
            detail=f"1 porción • {ing['calories']} Kcal"
        ))
    
    if not recent_foods:
        cursor_foods = foods_collection.find().limit(5)
        for food in cursor_foods:
            recent_foods.append(FoodItem(id=food["id"], name=food["name"], detail=food["detail"]))
            
    return recent_foods

class LogFoodRequest(BaseModel):
    food_name: str
    calories: int = 300

@router.post("/log", response_model=FoodItem)
async def log_food(request: LogFoodRequest, user_email: str = Depends(get_current_user_email)):
    food_in_db = foods_collection.find_one({"name": request.food_name})
    food_id = food_in_db["id"] if food_in_db else 9999
    
    # 1. Registrar Ingesta
    ingestion = {
        "user_email": user_email,
        "food_id": food_id,
        "food_name": request.food_name,
        "calories": request.calories,
        "date": datetime.now()
    }
    ingestions_collection.insert_one(ingestion)
    
    # 2. Actualizar registro diario (daily_records)
    # Usamos formato ISO (YYYY-MM-DD) para evitar problemas de idioma (dic vs Dec)
    today_str = datetime.now().date().isoformat()
    
    daily = daily_records_collection.find_one({"user_email": user_email, "date": today_str})
    
    if daily:
        new_calories = daily["calories"] + request.calories
        daily_records_collection.update_one(
            {"_id": daily["_id"]},
            {"$set": {"calories": new_calories}}
        )
    else:
        # Aquí era donde fallaba antes por falta del import
        profile = profiles_collection.find_one({"user_email": user_email})
        target = profile.get("caloriesTarget", 1800) if profile else 1800
        
        daily_records_collection.insert_one({
            "user_email": user_email,
            "date": today_str,
            "calories": request.calories,
            "target": target,
            "status": "inprogress"
        })
    
    return FoodItem(id=food_id, name=request.food_name, detail=f"1 porción • {request.calories} Kcal")