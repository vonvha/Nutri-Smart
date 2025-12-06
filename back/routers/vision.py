from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from models.nutrition import FoodAnalysis
from services.gemini_service import analyze_image_nutrition

from config.database import foods_collection

router = APIRouter()

@router.post("/analyze-food", response_model=FoodAnalysis)
async def analyze_food_image(file: UploadFile = File(...)):
    """
    Endpoint para analizar una imagen de comida.
    Recibe un archivo de imagen y devuelve un análisis nutricional.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="El archivo debe ser una imagen."
        )

    image_bytes = await file.read()
    
    analysis_result = analyze_image_nutrition(image_bytes)

    if not analysis_result["is_food"]:
        return FoodAnalysis(is_food=False, message=analysis_result.get("message"))

    # Lógica para guardar el alimento si es nuevo
    food_name = analysis_result.get("name", "Alimento Desconocido")
    
    # Buscar si ya existe (case insensitive)
    import re
    existing_food = foods_collection.find_one({"name": {"$regex": f"^{re.escape(food_name)}$", "$options": "i"}})
    
    if not existing_food:
        # Generar nuevo ID (encontrando el max actual + 1)
        # Nota: Esto no es thread-safe en alta concurrencia pero sirve para este MVP/demo
        last_food = foods_collection.find_one(sort=[("id", -1)])
        new_id = (last_food["id"] + 1) if last_food else 1
        
        new_food = {
            "id": new_id,
            "name": food_name,
            "detail": f"1 porción • {analysis_result.get('calories')} Kcal",
            "calories": analysis_result.get("calories"),
            "protein": analysis_result.get("protein"),
            "fat": analysis_result.get("fat")
        }
        foods_collection.insert_one(new_food)

    return FoodAnalysis(
        is_food=True,
        name=food_name,
        calories=analysis_result.get("calories"),
        protein=analysis_result.get("protein"),
        fat=analysis_result.get("fat")
    )
