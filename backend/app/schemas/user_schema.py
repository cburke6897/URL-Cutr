from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ChangeUsername(BaseModel):
    email: EmailStr
    password: str
    new_username: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime
    admin: bool

    class Config:
        from_attributes = True