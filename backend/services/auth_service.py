from model.user import User
from config.database import db, pwd_context
from flask_jwt_extended import create_access_token

class AuthService:
    """
    Service class for authentication-related operations.
    """
    
    @staticmethod
    def authenticate_user(username: str, password: str):
        """
        Authenticate a user with username and password.
        
        Args:
            username (str): Username
            password (str): Password
            
        Returns:
            tuple: (user, token) or (None, None) if authentication fails
        """
        user = User.query.filter_by(username=username).first()
        
        if user and user.verify_password(password):
            token = create_access_token(identity=str(user.id))
            return user, token
        
        return None, None
    
    @staticmethod
    def create_user(username: str, email: str, password: str):
        """
        Create a new user.
        
        Args:
            username (str): Username
            email (str): Email
            password (str): Password
            
        Returns:
            User: Created user object or None if creation fails
        """
        try:
            hashed_password = pwd_context.hash(password)
            
            new_user = User(
                username=username,
                email=email,
                hashed_password=hashed_password,
                is_active=True,
                is_superuser=False
            )
            
            db.session.add(new_user)
            db.session.commit()
            
            return new_user
        except Exception as e:
            db.session.rollback()
            print(f"Error creating user: {e}")
            return None