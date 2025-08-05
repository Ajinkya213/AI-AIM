from config.database import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

class Document(db.Model):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    filepath = Column(String(500), nullable=False, unique=True)
    upload_date = Column(DateTime, default=datetime.utcnow)
    file_size_bytes = Column(Integer, nullable=False)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('documents', lazy=True))

    def __repr__(self):
        return f"<Document {self.id}: {self.filename}>"