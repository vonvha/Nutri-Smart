from fastapi import APIRouter, Depends
from typing import List, Optional
from pydantic import BaseModel
from models.nutrition import FoodItem
from config.database import foods_collection, ingestions_collection, daily_records_collection, profiles_collection
from dependencies import get_current_user_email
from datetime import datetime
import re

router = APIRouter()

@router.get("/recent", response_model=List[FoodItem])
async def get_recent_foods(user_email: str = Depends(get_current_user_email)):
    cursor = ingestions_collection.find({"user_email": user_email}).sort("date", -1).limit(10)
    recent_foods = []
    
    # Usamos un set para evitar duplicados visuales en recientes si se desea
    seen_names = set()
    
    for ing in cursor:
        if ing["food_name"] not in seen_names:
            recent_foods.append(FoodItem(
                id=ing.get("food_id", 0),
                name=ing["food_name"],
                detail=f"1 porción • {ing['calories']} Kcal"
            ))
            seen_names.add(ing["food_name"])
    
    # Si no hay recientes, devolvemos algunos por defecto
    if not recent_foods:
        cursor_foods = foods_collection.find().limit(5)
        for food in cursor_foods:
            recent_foods.append(FoodItem(id=food["id"], name=food["name"], detail=food["detail"]))
            
    return recent_foods

# --- NUEVO ENDPOINT DE BÚSQUEDA GLOBAL ---
@router.get("/search", response_model=List[FoodItem])
async def search_foods(q: Optional[str] = ""):
    """
    Busca alimentos en la base de datos global.
    Si q está vacío, devuelve todos (o un límite).
    Si q tiene texto, filtra por nombre (case insensitive).
    """
    if q:
        # Búsqueda por regex insensible a mayúsculas/minúsculas
        regex_pattern = re.compile(f".*{re.escape(q)}.*", re.IGNORECASE)
        cursor = foods_collection.find({"name": {"$regex": regex_pattern}}).limit(50)
    else:
        # Si no hay query, devolvemos los primeros 100 para mostrar la lista completa
        cursor = foods_collection.find().limit(100)

    results = []
    for food in cursor:
        results.append(FoodItem(
            id=food["id"],
            name=food["name"],
            detail=food["detail"]
        ))
    
    return results

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
    
    # 2. Actualizar registro diario
    today_str = datetime.now().date().isoformat()
    daily = daily_records_collection.find_one({"user_email": user_email, "date": today_str})
    
    if daily:
        new_calories = daily["calories"] + request.calories
        daily_records_collection.update_one(
            {"_id": daily["_id"]},
            {"$set": {"calories": new_calories}}
        )
    else:
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