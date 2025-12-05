from config.database import (
    users_collection, profiles_collection, foods_collection, 
    ingestions_collection, daily_records_collection, 
    notifications_collection, consultations_collection
)
from datetime import datetime, timedelta
import random

# --- DATOS DE ALIMENTOS (100 Items Reales) ---
food_data = [
    # Proteínas
    {"name": "Pechuga de Pollo (100g)", "calories": 165, "protein": 31, "carbs": 0, "fat": 3.6, "detail": "100g • 165 Kcal"},
    {"name": "Huevo Cocido (1 ud)", "calories": 78, "protein": 6, "carbs": 0.6, "fat": 5, "detail": "1 unidad • 78 Kcal"},
    {"name": "Atún en agua (1 lata)", "calories": 120, "protein": 26, "carbs": 0, "fat": 1, "detail": "1 lata • 120 Kcal"},
    {"name": "Carne de Res Magra (100g)", "calories": 250, "protein": 26, "carbs": 0, "fat": 15, "detail": "100g • 250 Kcal"},
    {"name": "Salmón (100g)", "calories": 208, "protein": 20, "carbs": 0, "fat": 13, "detail": "100g • 208 Kcal"},
    {"name": "Tofu (100g)", "calories": 76, "protein": 8, "carbs": 1.9, "fat": 4.8, "detail": "100g • 76 Kcal"},
    {"name": "Yogur Griego (1 taza)", "calories": 120, "protein": 20, "carbs": 8, "fat": 0, "detail": "1 taza • 120 Kcal"},
    {"name": "Batido Whey Protein (1 scoop)", "calories": 120, "protein": 24, "carbs": 3, "fat": 1, "detail": "1 scoop • 120 Kcal"},
    {"name": "Lentejas cocidas (1 taza)", "calories": 230, "protein": 18, "carbs": 40, "fat": 0.8, "detail": "1 taza • 230 Kcal"},
    {"name": "Garbanzos (1 taza)", "calories": 269, "protein": 14.5, "carbs": 45, "fat": 4, "detail": "1 taza • 269 Kcal"},
    
    # Carbohidratos
    {"name": "Arroz Integral (1 taza)", "calories": 216, "protein": 5, "carbs": 45, "fat": 1.8, "detail": "1 taza • 216 Kcal"},
    {"name": "Avena cocida (1 taza)", "calories": 158, "protein": 6, "carbs": 27, "fat": 3.2, "detail": "1 taza • 158 Kcal"},
    {"name": "Camote cocido (100g)", "calories": 86, "protein": 1.6, "carbs": 20, "fat": 0.1, "detail": "100g • 86 Kcal"},
    {"name": "Papa cocida (100g)", "calories": 77, "protein": 2, "carbs": 17, "fat": 0.1, "detail": "100g • 77 Kcal"},
    {"name": "Quinoa cocida (1 taza)", "calories": 185, "protein": 8, "carbs": 34, "fat": 3.6, "detail": "1 taza • 185 Kcal"},
    {"name": "Pan Integral (1 rebanada)", "calories": 80, "protein": 4, "carbs": 14, "fat": 1, "detail": "1 rebanada • 80 Kcal"},
    {"name": "Pasta Integral (1 taza)", "calories": 174, "protein": 7.5, "carbs": 37, "fat": 0.8, "detail": "1 taza • 174 Kcal"},
    {"name": "Tortilla de maíz (1 ud)", "calories": 52, "protein": 1.4, "carbs": 10, "fat": 0.7, "detail": "1 ud • 52 Kcal"},
    
    # Frutas y Verduras
    {"name": "Plátano (1 mediano)", "calories": 105, "protein": 1.3, "carbs": 27, "fat": 0.3, "detail": "1 unidad • 105 Kcal"},
    {"name": "Manzana (1 mediana)", "calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3, "detail": "1 unidad • 95 Kcal"},
    {"name": "Naranja (1 mediana)", "calories": 62, "protein": 1.2, "carbs": 15, "fat": 0.2, "detail": "1 unidad • 62 Kcal"},
    {"name": "Espinaca (1 taza cruda)", "calories": 7, "protein": 0.9, "carbs": 1, "fat": 0.1, "detail": "1 taza • 7 Kcal"},
    {"name": "Brócoli (1 taza)", "calories": 31, "protein": 2.6, "carbs": 6, "fat": 0.3, "detail": "1 taza • 31 Kcal"},
    {"name": "Zanahoria (1 mediana)", "calories": 25, "protein": 0.6, "carbs": 6, "fat": 0.1, "detail": "1 unidad • 25 Kcal"},
    {"name": "Palta / Aguacate (Media)", "calories": 160, "protein": 2, "carbs": 9, "fat": 15, "detail": "Media unidad • 160 Kcal"},
    
    # Grasas y Snacks
    {"name": "Almendras (30g)", "calories": 164, "protein": 6, "carbs": 6, "fat": 14, "detail": "30g • 164 Kcal"},
    {"name": "Mantequilla de Maní (1 cda)", "calories": 94, "protein": 4, "carbs": 3, "fat": 8, "detail": "1 cda • 94 Kcal"},
    {"name": "Aceite de Oliva (1 cda)", "calories": 119, "protein": 0, "carbs": 0, "fat": 13.5, "detail": "1 cda • 119 Kcal"},
    {"name": "Chocolate Negro 70% (20g)", "calories": 120, "protein": 2, "carbs": 9, "fat": 8, "detail": "20g • 120 Kcal"},
]



def seed():
    # ... (limpieza e inserción de foods y users igual que antes) ...
    # (Copiar la lógica de limpieza e inserts de foods/users del script anterior)
    
    print("🧹 Limpiando y repoblando con formato de fecha corregido...")
    users_collection.delete_many({})
    profiles_collection.delete_many({})
    foods_collection.delete_many({})
    ingestions_collection.delete_many({})
    daily_records_collection.delete_many({})
    notifications_collection.delete_many({})
    consultations_collection.delete_many({})

    # ... Insertar foods (copiar del script anterior) ...
    for idx, food in enumerate(food_data, 1):
        food["id"] = idx 
    foods_collection.insert_many(food_data)

    # ... Insertar usuarios y perfiles (copiar del script anterior) ...
    # Usuario 1: Carla
    user1 = {"email": "carla.fit@smartfit.com", "name": "Carla Fit", "password": "password123-hashed", "created_at": datetime.now()}
    users_collection.insert_one(user1)
    profiles_collection.insert_one({
        "user_email": user1["email"], "goal": "Perder peso", "weight": 70.5, "height": 170, "age": 28, "sex": "Femenino", "activityLevel": "Moderado", "allergies": ["Lactosa"], "caloriesTarget": 1800, "macros": {"protein": 140, "carbs": 180, "fat": 60}
    })

    # Usuario 2: Renzo
    user2 = {"email": "renzo.strong@smartfit.com", "name": "Renzo Strong", "password": "gymrat-hashed", "created_at": datetime.now()}
    users_collection.insert_one(user2)
    profiles_collection.insert_one({
        "user_email": user2["email"], "goal": "Ganar músculo", "weight": 82.0, "height": 180, "age": 25, "sex": "Masculino", "activityLevel": "Intenso", "allergies": [], "caloriesTarget": 2800, "macros": {"protein": 200, "carbs": 350, "fat": 80}
    })

    print("📅 Creando historial y notificaciones...")
    
    # AQUI ESTA EL CAMBIO IMPORTANTE: Formato ISO YYYY-MM-DD
    today = datetime.now().date().isoformat()
    yesterday = (datetime.now() - timedelta(days=1)).date().isoformat()

    daily_records_collection.insert_many([
        {
            "user_email": user1["email"],
            "date": today,
            "calories": 1200,
            "target": 1800,
            "status": "inprogress"
        },
        {
            "user_email": user1["email"],
            "date": yesterday,
            "calories": 1750,
            "target": 1800,
            "status": "success"
        }
    ])
    
    # ... (Resto de notificaciones igual) ...
    notifications_collection.insert_many([
        {"id": 1, "user_email": user1["email"], "type": "alert", "title": "Hidratación", "time": "10 min", "description": "Beber agua", "isRead": False},
        {"id": 2, "user_email": user2["email"], "type": "goal", "title": "Meta Proteína", "time": "1h", "description": "Logrado", "isRead": True}
    ])

    print("✅ Base de datos reparada y lista.")

if __name__ == "__main__":
    seed()