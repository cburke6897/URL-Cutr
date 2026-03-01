from pydantic import BaseModel, EmailStr

class ResetPasswordEmail(BaseModel):
    email: EmailStr

class VerifyTokenRequest(BaseModel):
    token: str