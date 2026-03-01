import secrets
from fastapi import APIRouter, Depends, HTTPException
from requests import Session
from app.core.config import settings
from app.db.session import get_db
import resend
from app.cruds.user_crud import authenticate_user, get_user_by_email
from app.schemas.delete_schema import DeleteAccountEmail, VerifyTokenRequest, DeleteAccountRequest
from app.cruds.delete_token_crud import delete_delete_token, save_delete_token, verify_and_get_delete_token
from app.cruds.url_crud import get_urls_by_user
from app.models.reset_token_model import ResetToken
from app.models.refresh_token_model import RefreshToken

router = APIRouter()

resend.api_key = settings.resend_api_key

@router.post("/send-delete-account-email")
def send_delete_account_email(payload: DeleteAccountEmail, db: Session = Depends(get_db)):
    # Check if user exists
    user = get_user_by_email(db, payload.email)
    
    # Only send email if user exists (security: don't reveal if email is registered)
    if user:
        # Generate cryptographically secure random token
        delete_token = secrets.token_urlsafe(32)
        
        # Save token to database (will be hashed by save_delete_token function)
        save_delete_token(db, user.email, delete_token)
        
        # Construct reset link with plain token
        delete_link = f"{settings.frontend_url}/delete-account?token={delete_token}"
        
        html_content = f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 40px 30px; text-align: center;">
                                <h1 style="color: #007bff; margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">URL Cutr</h1>
                                <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px; font-weight: normal;">Delete Account Request</h2>
                                <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                    We received a request to delete your account for your URL Cutr account. Click the button below to delete your account.
                                </p>
                                <a href="{delete_link}" style="display: inline-block; padding: 14px 40px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Delete Account</a>
                                <p style="color: #999999; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                                    If you didn't request this, consider changing your password.
                                </p>
                                <p style="color: #999999; line-height: 1.6; margin: 10px 0 0 0; font-size: 12px;">
                                    This link will expire in 15 minutes.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        """
        
        params: resend.Emails.SendParams = {
            "from": f"URL Cutr <{settings.support_email}>",
            "to": [payload.email],
            "subject": "URL Cutr - Delete Account Request",
            "html": html_content
        }
        
        try:
            resend.Emails.send(params)
        except Exception as e:
            # Log error and return error message
            print(f"Failed to send email: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to send delete account email. Please try again later.")
    
    return {"message": "Delete account request received. A delete account link has been sent to your email."}


@router.post("/verify-delete-token")
def verify_delete_token_route(payload: VerifyTokenRequest, db: Session = Depends(get_db)):
    # Verify if a delete token is valid and not expired
    token_record = verify_and_get_delete_token(db, payload.token)
    
    if not token_record:
        raise HTTPException(status_code=400, detail="Invalid or expired delete token")
    
    # Get user by email
    user = get_user_by_email(db, token_record.user_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "valid": True,
    }

@router.post("/delete-account")
def delete_account(payload: DeleteAccountRequest, db: Session = Depends(get_db)):
    # Verify if a delete token is valid and not expired
    token_record = verify_and_get_delete_token(db, payload.token)
    
    if not token_record:
        raise HTTPException(status_code=400, detail="Invalid or expired delete token")
    
    # Get user by email
    user = authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=404, detail="Invalid email or password")
    
    # Delete all URLs associated with the user
    user_urls = get_urls_by_user(db, user.id)
    for url in user_urls:
        db.delete(url)
    
    # Delete all reset tokens associated with the user
    db.query(ResetToken).filter(ResetToken.user_email == user.email).delete()
    
    # Delete all refresh tokens associated with the user
    db.query(RefreshToken).filter(RefreshToken.user_id == user.id).delete()
    
    # Delete the user account
    db.delete(user)
    
    # Delete the used delete token
    delete_delete_token(db, token_record.id)
    
    db.commit()
    
    return {"message": "Account deleted successfully"}