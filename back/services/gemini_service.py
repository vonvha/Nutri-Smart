import os
import google.generativeai as genai
import json
from PIL import Image
import io

# Cargar variables de entorno
from dotenv import load_dotenv
load_dotenv()

# Configurar la API de Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("No se encontró la API Key de Gemini. Asegúrate de que está en el archivo .env")

genai.configure(api_key=GEMINI_API_KEY)

# Configuración del modelo
generation_config = {
  "temperature": 0.2,
  "top_p": 1,
  "top_k": 32,
  "max_output_tokens": 4096,
}

safety_settings = [
  {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
  {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
  {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
  {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model = genai.GenerativeModel(
    model_name="gemini-robotics-er-1.5-preview",
    generation_config=generation_config,
    safety_settings=safety_settings
)

def analyze_image_nutrition(image_bytes: bytes):
    """
    Analiza una imagen de comida usando Gemini y devuelve la información nutricional.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))

        prompt_parts = [
          "Analiza la siguiente imagen. Determina si contiene comida.",
          "Si es comida, responde únicamente con un objeto JSON con las siguientes claves y valores numéricos estimados: 'calories', 'protein', 'fat'.",
          "Si no es comida, responde únicamente con un objeto JSON con la clave 'message' y el valor 'La imagen no parece ser comida.'.",
          "No incluyas ninguna otra explicación o texto fuera del objeto JSON.",
          "Ejemplo si es comida: {\"calories\": 350, \"protein\": 25, \"fat\": 15}",
          "Ejemplo si no es comida: {\"message\": \"La imagen no parece ser comida.\"}",
          "\n",
          image,
        ]

        response = model.generate_content(prompt_parts)
        
        # Limpiar la respuesta para obtener solo el JSON
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        
        data = json.loads(cleaned_response)

        if "message" in data:
            return {"is_food": False, "message": data["message"]}
        
        return {
            "is_food": True,
            "calories": data.get("calories"),
            "protein": data.get("protein"),
            "fat": data.get("fat")
        }

    except json.JSONDecodeError:
        return {"is_food": False, "message": "Error al procesar la respuesta del modelo."}
    except Exception as e:
        return {"is_food": False, "message": f"Ha ocurrido un error inesperado: {str(e)}"}

