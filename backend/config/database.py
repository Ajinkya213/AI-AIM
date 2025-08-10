from flask_sqlalchemy import SQLAlchemy
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_database(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("MYSQL_DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        print("Database tables created/checked.")