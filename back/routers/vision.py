from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from models.nutrition import FoodAnalysis
from services.gemini_service import analyze_image_nutrition

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

    return FoodAnalysis(
        is_food=True,
        calories=analysis_result.get("calories"),
        protein=analysis_result.get("protein"),
        fat=analysis_result.get("fat")
    )
