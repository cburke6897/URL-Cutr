from pydantic import BaseModel, EmailStr

class ResetPasswordEmail(BaseModel):
    email: EmailStr