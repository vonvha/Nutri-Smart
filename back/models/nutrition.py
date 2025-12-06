from pydantic import BaseModel
from typing import List, Optional

class NutritionProfile(BaseModel):
    goal: str
    weight: float
    height: float
    age: int
    sex: str
    activityLevel: str
    allergies: List[str] = []

class Meal(BaseModel):
    type: str
    name: str
    kcal: int
    macros: str

class HistoryDay(BaseModel):
    date: str
    calories: int
    target: int
    status: str

class FoodItem(BaseModel):
    id: int # Mantuvimos IDs numéricos en el seed para compatibilidad
    name: str
    detail: str

class FoodAnalysis(BaseModel):
    is_food: bool
    calories: Optional[int] = None
    protein: Optional[int] = None
    fat: Optional[int] = None
    message: Optional[str] = None

class Notification(BaseModel):
    id: int
    type: str
    title: str
    time: str
    description: str
    isRead: bool

class Appointment(BaseModel):
    date: str
    time: str
    type: str

