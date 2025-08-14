from flask import Flask
from flask_jwt_extended import JWTManager
from config.database import init_database
from config.settings import Config
from routes.auth import auth_bp
from routes.documents import documents_bp
from routes.chat import chat_bp
from routes.users import users_bp
from routes.agent import agent_bp
from middleware.error_handlers import register_error_handlers
import os
from flask_cors import CORS

def create_app():
    """
    Application factory pattern to create and configure the Flask app.
    
    Returns:
        Flask: Configured Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)

    # Initialize CORS - Add this section
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True
        }
    })
    # Initialize extensions
    jwt = JWTManager(app)
    init_database(app)
    
    # Setup JWT blocklist
    @jwt.token_in_blocklist_loader
    def check_if_token_is_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in Config.blocklist
    
    # Create upload folder if it doesn't exist
    if not os.path.exists(Config.UPLOAD_FOLDER):
        os.makedirs(Config.UPLOAD_FOLDER)
        print(f"Created upload folder: {Config.UPLOAD_FOLDER}")
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(documents_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(agent_bp)
    
    # Root route
    @app.route("/")
    def home():
        return {
            "message": "Hello from Simple Flask & MySQL Backend!",
            "endpoints": {
                "users": "/users",
                "login": "/login",
                "documents": "/documents",
                "chat_sessions": "/chat_sessions",
                "query": "/query/"
            }
        }
    
    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=8000, use_reloader=False)