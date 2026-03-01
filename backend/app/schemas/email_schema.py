from pydantic import BaseModel, EmailStr

class ResetPasswordEmail(BaseModel):
    email: EmailStr

class VerifyTokenRequest(BaseModel):
    token: str

class ResetPassword(BaseModel):
    token: str
    new_password: str