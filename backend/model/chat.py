from config.database import db
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime, timezone

class ChatSession(db.Model):
    __tablename__ = 'chat_sessions'
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('chat_sessions', lazy=True))
    messages = db.relationship('ChatMessage', backref='session_obj', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<ChatSession {self.id}: {self.title}>"

class ChatMessage(db.Model):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(4096), nullable=False)
    is_user_message = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)

    def __repr__(self):
        return f'<ChatMessage {self.id}>'