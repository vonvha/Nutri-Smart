import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Asegúrate de que tu .env tenga MONGO_URI="mongodb://localhost:27017/" y DB_NAME="nutrismart"
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "nutrismart")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Colecciones mapeadas según tu imagen y requerimientos
users_collection = db["users"]
profiles_collection = db["profiles"]
foods_collection = db["foods"]
ingestions_collection = db["ingestions"]
daily_records_collection = db["daily_records"]
consultations_collection = db["consultations"] # Usado para Citas/Appointments
notifications_collection = db["notifications"] # Agregamos esta para notificaciones

def get_db():
    return db
