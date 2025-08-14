from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.chat import ChatSession, ChatMessage
from config.database import db
from services.query_service import process_query
import asyncio

chat_bp = Blueprint('chat', __name__)

@chat_bp.route("/chat_sessions", methods=["POST"])
@jwt_required()
def create_chat_session():
    try:
        current_user_id = get_jwt_identity()
        user = db.session.get(User, current_user_id)

        if not user:
            return jsonify({"msg": "User not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        title = data.get("title")
        if not title:
            return jsonify({"error": "Title is required for a chat session"}), 400

        new_session = ChatSession(
            title=title,
            owner=user
        )

        db.session.add(new_session)
        db.session.commit()
        
        return jsonify({
            "id": new_session.id,
            "title": new_session.title,
            "owner_id": new_session.owner_id,
            "created_at": new_session.created_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error during chat session creation", "details": str(e)}), 500

@chat_bp.route("/chat_sessions", methods=["GET"])
@jwt_required()
def get_chat_sessions():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    sessions = ChatSession.query.filter_by(owner=user).all()
    sessions_list = []
    for session in sessions:
        sessions_list.append({
            "id": session.id,
            "title": session.title,
            "owner_id": session.owner_id,
            "created_at": session.created_at.isoformat(),
            "updated_at": session.updated_at.isoformat()
        })
    return jsonify(sessions_list), 200


@chat_bp.route("/chat_sessions/<int:session_id>/messages", methods=["GET"])
@jwt_required()
def get_chat_messages(session_id):
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    session = db.session.get(ChatSession, session_id)
    if not session:
        return jsonify({"error": "Chat session not found"}), 404

    if session.owner_id != user.id:
        return jsonify({"error": "You do not have permission to view messages in this session"}), 403

    messages = ChatMessage.query.filter_by(session_id=session.id).order_by(ChatMessage.created_at).all()

    messages_list = []
    for message in messages:
        messages_list.append({
            "id": message.id,
            "session_id": message.session_id,
            "content": message.content,
            "is_user_message": message.is_user_message,
            "created_at": message.created_at.isoformat()
        })
    return jsonify(messages_list), 200

@chat_bp.route("/chat_sessions/<int:session_id>", methods=["DELETE"])
@jwt_required()
def delete_chat_session(session_id):
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    session = db.session.get(ChatSession, session_id)
    if not session:
        return jsonify({"error": "Chat session not found"}), 404

    if session.owner_id != user.id:
        return jsonify({"error": "You do not have permission to delete this chat session"}), 403

    try:
        db.session.delete(session)
        db.session.commit()
        return jsonify({"msg": f"Chat session '{session.title}' and all its messages deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting chat session: {e}")
        return jsonify({"error": "Error deleting chat session", "details": str(e)}), 500

@chat_bp.route("/chat_sessions/<int:session_id>", methods=["PUT"])
@jwt_required()
def update_chat_session(session_id):
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    session = db.session.get(ChatSession, session_id)
    if not session:
        return jsonify({"error": "Chat session not found"}), 404

    if session.owner_id != user.id:
        return jsonify({"error": "You do not have permission to update this chat session"}), 403

    data = request.get_json()
    print(f"Received data: {data}")
    title = data.get("title")
    print(f"OLD Received title: {title}")
    if not title:
        return jsonify({"error": "Title is required for a chat session"}), 400

    try:
        session.title = title
        print(f"Updated chat session title to: {title}")
        db.session.commit()
        return jsonify({
            "id": session.id,
            "title": session.title,
            "owner_id": session.owner_id,
            "created_at": session.created_at.isoformat(),
            "updated_at": session.updated_at.isoformat()
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating chat session: {e}")
        return jsonify({"error": "Error updating chat session", "details": str(e)}), 500
    
# TODO: Add SendChat commit!

