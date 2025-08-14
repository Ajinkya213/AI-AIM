from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from model.document import Document
from model.user import User
from config.database import db

documents_bp = Blueprint('documents', __name__)

@documents_bp.route("/documents/<int:document_id>", methods=["DELETE"])
@jwt_required()
def delete_document(document_id):
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    document = db.session.get(Document, document_id)
    if not document:
        return jsonify({"error": "Document not found"}), 404

    if document.owner_id != user.id:
        return jsonify({"error": "You do not have permission to delete this document"}), 403

    try:
        if os.path.exists(document.filepath):
            os.remove(document.filepath)

        db.session.delete(document)
        db.session.commit()
        return jsonify({"msg": f"Document '{document.filename}' and its record deleted successfully."}), 200

    except OSError as e:
        db.session.rollback()
        print(f"Error deleting file from filesystem: {e}")
        return jsonify({"error": "Error deleting file from server storage", "details": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting document record: {e}")
        return jsonify({"error": "Error deleting document record from database", "details": str(e)}), 500