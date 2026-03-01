from pydantic import BaseModel, EmailStr

class DeleteAccountEmail(BaseModel):
    email: EmailStr

class VerifyTokenRequest(BaseModel):
    token: str

class DeleteAccountRequest(BaseModel):
    token: str
    email: EmailStr
    password: str