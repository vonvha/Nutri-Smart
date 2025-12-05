from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    # MongoDB usa _id, pero lo manejaremos internamente o lo ignoramos en la respuesta simple
    pass

class UserInDB(User):
    password: str # El hash guardado

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict
