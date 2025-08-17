from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from model.document import Document
from model.user import User
from config.database import db
from config.settings import Config
from utils.file_utils import allowed_file
from services.query_service import process_documents

documents_bp = Blueprint('documents', __name__)

@documents_bp.route("/documents", methods=["POST"])
@jwt_required()
async def upload_document():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)

        try:
            file.save(filepath)
            
            if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
                raise Exception("File was not saved properly or is empty")

            file_size_bytes = os.path.getsize(filepath)
            
            new_document = Document(
                filename=filename,
                filepath=filepath,
                file_size_bytes=file_size_bytes,
                owner_id=user.id
            )
            db.session.add(new_document)
            db.session.commit()
            
            try:
                files_list = [filepath]
                processing_result = await process_documents(files_list)
                
                return jsonify({
                    "msg": "File uploaded and processed successfully",
                    "id": new_document.id,
                    "filename": new_document.filename,
                    "filepath": new_document.filepath,
                    "upload_date": new_document.upload_date.isoformat(),
                    "file_size_bytes": new_document.file_size_bytes,
                    "processing_result": processing_result
                }), 201
                
            except Exception as processing_error:
                print(f"Error processing document {filename}: {processing_error}")
                return jsonify({
                    "msg": "File uploaded successfully but processing failed",
                    "id": new_document.id,
                    "filename": new_document.filename,
                    "filepath": new_document.filepath,
                    "upload_date": new_document.upload_date.isoformat(),
                    "file_size_bytes": new_document.file_size_bytes,
                    "processing_error": str(processing_error),
                    "warning": "Document was saved but could not be processed for search functionality"
                }), 201

        except Exception as e:
            db.session.rollback()
            if os.path.exists(filepath):
                os.remove(filepath)
            print(f"Error uploading document: {e}")
            return jsonify({"error": "Could not upload document", "details": str(e)}), 500
    else:
        return jsonify({"error": "File type not allowed"}), 400

@documents_bp.route("/documents", methods=["GET"])
@jwt_required()
def list_documents():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    documents = Document.query.filter_by(owner_id=user.id).all()

    documents_list = []
    for doc in documents:
        documents_list.append({
            "id": doc.id,
            "filename": doc.filename,
            "filepath": doc.filepath,
            "upload_date": doc.upload_date.isoformat(),
            "file_size_bytes": doc.file_size_bytes,
            "owner_id": doc.owner_id
        })
    return jsonify(documents_list), 200

@documents_bp.route("/documents/<int:document_id>", methods=["GET"])
@jwt_required()
def get_document_metadata(document_id):
    document = db.session.get(Document, document_id)
    if not document:
        return jsonify({"error": "Document not found"}), 404
    
    if int(document.owner_id) != int(get_jwt_identity()):
        return jsonify({"error": "You do not have permission to view this document"}), 403
    
    return jsonify({
        "id": document.id,
        "filename": document.filename,
        "filepath": document.filepath,
        "upload_date": document.upload_date.isoformat(),
        "file_size_bytes": document.file_size_bytes
    }), 200

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