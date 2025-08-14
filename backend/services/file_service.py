import os
from werkzeug.utils import secure_filename
from models.document import Document
from config.database import db
from config.settings import Config
from utils.file_utils import allowed_file, validate_file_exists

class FileService:
    """
    Service class for file-related operations.
    """
    
    @staticmethod
    def save_uploaded_file(file, user_id: int):
        """
        Save an uploaded file and create a document record.
        
        Args:
            file: Uploaded file object
            user_id (int): ID of the user uploading the file
            
        Returns:
            tuple: (document, error_message) - document object or None if failed
        """
        if not file or file.filename == '':
            return None, "No file selected"
        
        if not allowed_file(file.filename):
            return None, "File type not allowed"
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        
        try:
            # Save the file
            file.save(filepath)
            
            # Validate the saved file
            is_valid, error_msg = validate_file_exists(filepath)
            if not is_valid:
                if os.path.exists(filepath):
                    os.remove(filepath)
                return None, error_msg
            
            # Get file size
            file_size_bytes = os.path.getsize(filepath)
            
            # Create document record
            new_document = Document(
                filename=filename,
                filepath=filepath,
                file_size_bytes=file_size_bytes,
                owner_id=user_id
            )
            
            db.session.add(new_document)
            db.session.commit()
            
            return new_document, None
            
        except Exception as e:
            db.session.rollback()
            if os.path.exists(filepath):
                os.remove(filepath)
            return None, str(e)
    
    @staticmethod
    def delete_document_file(document):
        """
        Delete a document file and its database record.
        
        Args:
            document: Document object to delete
            
        Returns:
            tuple: (success, error_message)
        """
        try:
            # Delete physical file
            if os.path.exists(document.filepath):
                os.remove(document.filepath)
            
            # Delete database record
            db.session.delete(document)
            db.session.commit()
            
            return True, None
            
        except Exception as e:
            db.session.rollback()
            return False, str(e)