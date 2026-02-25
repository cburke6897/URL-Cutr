from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.cruds.user_crud import create, authenticate_user
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.core.deps import get_current_user
from app.core.security import create_access_token, create_refresh_token
from app.cruds.refresh_token_crud import save_refresh_token, refresh_token_exists, delete_refresh_token
from app.core.security import REFRESH_TOKEN_SECRET_KEY, ALGORITHM
from jose import jwt

REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60  # 7 days in seconds

router = APIRouter()

@router.post("/login")
def login(payload: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    save_refresh_token(db, user.id, refresh_token)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=REFRESH_TOKEN_MAX_AGE
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    print(refresh_token)
    if refresh_token:
        print(f"Logging out user with refresh token: {refresh_token}")
        try:
            delete_refresh_token(db, refresh_token)
            response.delete_cookie(
                key="refresh_token",
                httponly=True,
                secure=True,
                samesite="strict"
                )
        finally:
            db.close()

    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}

@router.post("/signup")
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    user = create(db, payload.email, payload.username, payload.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    return {"message": "User created successfully"}

@router.post("/refresh")
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    # Validate token
    try:
        payload = jwt.decode(refresh_token, REFRESH_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Check DB to ensure token is still valid
    if not refresh_token_exists(db, refresh_token):
        raise HTTPException(status_code=401, detail="Token revoked")
    
    # Revoke old refresh token
    delete_refresh_token(db, refresh_token)

    # Issue new access token
    new_access_token = create_access_token({"sub": user_id})

    # Issue new refresh token and save to DB
    new_refresh_token = create_refresh_token(data={"sub": user_id})
    save_refresh_token(db, user_id, new_refresh_token)

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age= REFRESH_TOKEN_MAX_AGE
    )

    return {"access_token": new_access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return current_user