from fastapi import APIRouter, Depends
from models.nutrition import NutritionProfile
from config.database import profiles_collection
from dependencies import get_current_user_email # Importamos la dependencia

router = APIRouter()

@router.get("/", response_model=NutritionProfile)
async def get_profile(user_email: str = Depends(get_current_user_email)):
    # Usamos el email extraído del token
    profile = profiles_collection.find_one({"user_email": user_email})
    
    if not profile:
        return NutritionProfile(
            goal='No definido', weight=0, height=0, age=0, 
            sex='No definido', activityLevel='No definido', allergies=[]
        )
    
    return NutritionProfile(
        goal=profile["goal"],
        weight=profile["weight"],
        height=profile["height"],
        age=profile["age"],
        sex=profile["sex"],
        activityLevel=profile["activityLevel"],
        allergies=profile.get("allergies", [])
    )

@router.post("/", response_model=NutritionProfile)
async def create_or_update_profile(
    profile_data: NutritionProfile, 
    user_email: str = Depends(get_current_user_email)
):
    profile_dict = profile_data.dict()
    profile_dict["user_email"] = user_email
    
    # Lógica de cálculo (reutilizada)
    bmr = 10 * profile_data.weight + 6.25 * profile_data.height - 5 * profile_data.age
    if profile_data.sex == "Masculino": bmr += 5
    else: bmr -= 161
    
    activity_map = {"Sedentario": 1.2, "Ligero": 1.375, "Moderado": 1.55, "Intenso": 1.725}
    factor = activity_map.get(profile_data.activityLevel, 1.2)
    tdee = bmr * factor
    
    if profile_data.goal == "Perder peso": tdee -= 500
    elif profile_data.goal == "Ganar músculo": tdee += 300
    
    profile_dict["caloriesTarget"] = int(tdee)
    profile_dict["macros"] = {
        "protein": int((tdee * 0.3) / 4),
        "carbs": int((tdee * 0.4) / 4),
        "fat": int((tdee * 0.3) / 9)
    }

    profiles_collection.update_one(
        {"user_email": user_email},
        {"$set": profile_dict},
        upsert=True
    )
    return profile_data