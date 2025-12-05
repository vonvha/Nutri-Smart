from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from models.user import User, UserCreate, Token
from config.database import users_collection
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=User)
async def register(user_in: UserCreate):
    # Verificar si existe
    if users_collection.find_one({"email": user_in.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = user_in.password + "-hashed"
    
    new_user = {
        "email": user_in.email,
        "name": user_in.name,
        "password": hashed_password,
        "created_at": datetime.now()
    }
    
    users_collection.insert_one(new_user)
    
    # Retornar sin el campo _id de mongo y sin password
    return User(email=new_user["email"], name=new_user["name"])

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_db = users_collection.find_one({"email": form_data.username})
    
    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificación simple de hash
    is_password_correct = (form_data.password + "-hashed") == user_db["password"]
    if not is_password_correct:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = f"{user_db['email']}-fake-jwt-token"
    
    user_response = {
        "name": user_db["name"],
        "email": user_db["email"]
    }
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user_response
    }