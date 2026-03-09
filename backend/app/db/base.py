from app.db.base_class import Base
# Import models so they are registered on Base.metadata for Alembic autogenerate.
from app.models.delete_token_model import DeleteToken
from app.models.refresh_token_model import RefreshToken
from app.models.reset_token_model import ResetToken 
from app.models.url_model import URL
from app.models.user_model import User