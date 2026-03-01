from fastapi import APIRouter, HTTPException, Depends
import resend
import secrets
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.cruds.user_crud import get_user_by_email
from app.schemas.email_schema import ResetPasswordEmail
from app.cruds.reset_token_crud import save_reset_token
from app.core.security import hash_reset_token

router = APIRouter()

resend.api_key = settings.resend_api_key

@router.post("/send-reset-password-email")
def send_reset_password_email(payload: ResetPasswordEmail, db: Session = Depends(get_db)):
    # Check if user exists
    user = get_user_by_email(db, payload.email)
    
    # Only send email if user exists (security: don't reveal if email is registered)
    if user:
        # Generate cryptographically secure random token
        reset_token = secrets.token_urlsafe(32)
        
        # Hash the token for secure storage
        hashed_token = hash_reset_token(reset_token)
        
        # Save hashed token to database (expires in 1 hour)
        save_reset_token(db, user.id, hashed_token)
        
        # Construct reset link with plain token
        reset_link = f"{settings.frontend_url}/change-password?token={reset_token}"
        
        html_content = f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 40px 30px; text-align: center;">
                                <h1 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h1>
                                <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                    We received a request to reset your password. Click the button below to create a new password.
                                </p>
                                <a href="{reset_link}" style="display: inline-block; padding: 14px 40px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Reset Password</a>
                                <p style="color: #999999; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                                    If you didn't request this, you can safely ignore this email.
                                </p>
                                <p style="color: #999999; line-height: 1.6; margin: 10px 0 0 0; font-size: 12px;">
                                    This link will expire in 1 hour.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        """
        
        params: resend.Emails.SendParams = {
            "from": f"Support <{settings.support_email}>",
            "to": [payload.email],
            "subject": "Password Reset Request",
            "html": html_content
        }
        
        try:
            resend.Emails.send(params)
        except Exception as e:
            # Log error and return error message
            print(f"Failed to send email: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to send password reset email. Please try again later.")
    
    # Always return same message (security: prevent user enumeration)
    return {"message": "If an account exists with this email, a password reset link has been sent"}