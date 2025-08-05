# C:\Users\Ajinkya\Desktop\project\backend\app.py

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, timezone
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta # To set token expiry
import os
from werkzeug.utils import secure_filename # Helps secure filenames for file uploads

# Load environment variables from .env file
load_dotenv()

# --- Flask App Configuration ---
app = Flask(__name__)

#Register blueprint
# app.register_blueprint(bp)

# MySQL connection string using pymysql
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("MYSQL_DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "a-very-random-secret-key-that-you-must-change-in-prod")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY") # ADD THIS LINE
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1) # ADD THIS LINE (Token valid for 1 hour)

db = SQLAlchemy(app)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

jwt = JWTManager(app) # ADD THIS LINE

# Setup our in-memory set for storing currently revoked tokens
# This is NOT persistent across restarts. For production, use Redis or a database.
blocklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in blocklist # <--- Use the in-memory set here

# Configuration for file uploads
# Ensure this directory exists relative to your app.py
# For example, if app.py is in 'backend', it will create 'backend/uploads'
UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER) # Create the directory if it doesn't exist
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload size (adjust as needed)

# Allowed extensions for documents (customize as needed)
ALLOWED_EXTENSIONS = {'pdf'} # <--- CHANGED TO ONLY ALLOW PDF

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Database Models ---
class User(db.Model):
    __tablename__ = 'users' # <--- ADD THIS LINE to resolve foreign key issue!
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(80), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    hashed_password = Column(String(128), nullable=False) # Your column name
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Corrected methods using pwd_context
    def verify_password(self, password: str):
        return pwd_context.verify(password, self.hashed_password)

    def hash_password(self, password: str):
        return pwd_context.hash(password)

    def __repr__(self):
        return f'<User {self.username}>'


# C:\Users\Ajinkya\Desktop\project\backend\app.py
# ... (Your existing ChatSession model code) ...

# --- ChatSession Model ---
class ChatSession(db.Model):
    __tablename__ = 'chat_sessions'
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner_id = Column(Integer, db.ForeignKey('users.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('chat_sessions', lazy=True))

    # --- CRITICAL CHANGE HERE: ADD cascade="all, delete-orphan" ---
    messages = db.relationship('ChatMessage', backref='session_obj', lazy=True, cascade="all, delete-orphan")


    def __repr__(self):
        return f"<ChatSession {self.id}: {self.title}>"

# ... (Rest of your app.py code) ...

# --- ChatMessage Model ---
class ChatMessage(db.Model):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(4096), nullable=False)
    is_user_message = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Foreign Key to ChatSession
    session_id = Column(Integer, db.ForeignKey("chat_sessions.id"), nullable=False)

    # The 'session_obj' backref is automatically created on ChatMessage by ChatSession's 'messages' relationship.
    # You do NOT need a db.relationship line here for 'session_obj' or 'session'.

    def __repr__(self):
        return f'<ChatMessage {self.id}>'

# C:\Users\Ajinkya\Desktop\project\backend\app.py
# ... (Your User, ChatSession, ChatMessage models) ...

class Document(db.Model):
    __tablename__ = 'documents' # Good practice to explicitly name tables
    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    filepath = Column(String(500), nullable=False, unique=True) # Full path where file is stored
    upload_date = Column(DateTime, default=datetime.utcnow)
    file_size_bytes = Column(Integer, nullable=False) # Store size for convenience

    # --- MAKE SURE THESE TWO LINES ARE UNCOMMENTED AND EXACTLY AS BELOW ---
    owner_id = Column(Integer, db.ForeignKey('users.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('documents', lazy=True))
    # --- END OF UNCOMMENTED LINES ---

    def __repr__(self):
        return f"<Document {self.id}: {self.filename}>"

# ... (Rest of your app.py code) ...


# --- Database Initialization (This block remains the same) ---
with app.app_context():
    print("Attempting to create/check database tables...")
    db.create_all() # This will now create ChatSession, ChatMessage, and Document tables
    print("Database tables created/checked.")


# --- API Endpoints ---

@app.route("/")
def home():
    return jsonify({"message": "Hello from Simple Flask & MySQL Backend! Try POST to /users."})

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not all([username, email, password]):
        return jsonify({"error": "Username, email, and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = pwd_context.hash(password)

    new_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        is_active=True,
        is_superuser=False
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "is_active": new_user.is_active,
            "created_at": new_user.created_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}")
        return jsonify({"error": "Could not create user", "details": str(e)}), 500

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    users_list = []
    for user in users:
        users_list.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat()
        })
    return jsonify(users_list), 200

# ... (existing / and /users routes)

@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    # This is the ONLY line you need to retrieve the user by username:
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"msg": "Bad username or password"}), 401

    # Use the verify_password method from your User model
    if not user.verify_password(password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token), 200

# --- Add a Sample for testing Protected Route ---
@app.route("/protected", methods=["GET"])
@jwt_required() # This decorator protects the route
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id) # Retrieve the user object if needed
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(logged_in_as=user.username, message="You accessed a protected route!"), 200


# C:\Users\Ajinkya\Desktop\project\backend\app.py
# ... (after your /protected route) ...

@app.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    token_id = get_jwt()["jti"] # get_jwt() returns the entire decoded JWT payload

    # Add the token's unique identifier to the blocklist (in-memory)
    blocklist.add(token_id)

    return jsonify(msg="Successfully logged out"), 200


# ... (rest of your app.py)

# --- Chat Session Endpoints ---

@app.route("/chat_sessions", methods=["POST"])
@jwt_required() # Requires a valid JWT to access
def create_chat_session():
    #print("DEBUG: Inside create_chat_session function.")
    try:
        current_user_id = get_jwt_identity()
        #print(f"DEBUG: JWT Identity (current_user_id): {current_user_id}, Type: {type(current_user_id)}")

        if current_user_id is None:
            #print("DEBUG: current_user_id is None after get_jwt_identity()")
            return jsonify({"msg": "Token identity missing"}), 401 # Should ideally be caught by jwt_required itself but good to check

        user = db.session.get(User, current_user_id)
        #print(f"DEBUG: Retrieved user: {user}")

        if not user:
            #print(f"DEBUG: User not found for ID: {current_user_id}")
            return jsonify({"msg": "User not found for token identity"}), 404

        data = request.get_json()
        #print(f"DEBUG: Request JSON data: {data}")

        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        title = data.get("title")
        #print(f"DEBUG: Received title: {title}")

        if not title:
            return jsonify({"error": "Title is required for a chat session"}), 400

        new_session = ChatSession(
            title=title,
            owner=user # Automatically sets owner_id via relationship
        )

        db.session.add(new_session)
        db.session.commit()
        #print("DEBUG: Chat session committed successfully.")
        return jsonify({
            "id": new_session.id,
            "title": new_session.title,
            "owner_id": new_session.owner_id,
            "created_at": new_session.created_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        #print(f"DEBUG: An unexpected error occurred: {e}")
        return jsonify({"error": "Internal server error during chat session creation", "details": str(e)}), 500


@app.route("/chat_sessions", methods=["GET"])
@jwt_required() # Requires a valid JWT to access
def get_chat_sessions():
    current_user_id = get_jwt_identity()
    user =  db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Retrieve chat sessions owned by the current user
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

# ... (Rest of your app.py code, including if __name__ == '__main__':) ...

# C:\Users\Ajinkya\Desktop\project\backend\app.py
# ... (Your existing /chat_sessions routes) ...

# --- Chat Message Endpoints ---
@app.route("/chat_sessions/<int:session_id>/messages", methods=["POST"])
@jwt_required()
def send_chat_message(session_id):
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id) # Using db.session.get()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    session = db.session.get(ChatSession, session_id) # Using db.session.get()
    if not session:
        return jsonify({"error": "Chat session not found"}), 404

    # Ensure the user owns this session before adding messages
    if session.owner_id != user.id:
        return jsonify({"error": "You do not have permission to add messages to this session"}), 403 # Forbidden

    data = request.get_json()
    content = data.get("content")
    is_user_message = data.get("is_user_message", True) # Default to True if not provided

    if not content:
        return jsonify({"error": "Message content is required"}), 400

    # THIS IS THE CRITICAL CHANGE:
    new_message = ChatMessage(
        content=content,
        is_user_message=is_user_message,
        session_id=session.id # <--- THIS MUST BE session_id=session.id
    )

    try:
        db.session.add(new_message)
        db.session.commit()
        return jsonify({
            "id": new_message.id,
            "session_id": new_message.session_id,
            "content": new_message.content,
            "is_user_message": new_message.is_user_message,
            "created_at": new_message.created_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error sending chat message: {e}")
        return jsonify({"error": "Could not send message", "details": str(e)}), 500


# ... (Your existing /chat_sessions routes and other code above this) ...

@app.route("/chat_sessions/<int:session_id>/messages", methods=["GET"])
@jwt_required()
def get_chat_messages(session_id):
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id) # Using db.session.get()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    session = db.session.get(ChatSession, session_id) # Using db.session.get()
    if not session:
        return jsonify({"error": "Chat session not found"}), 404

    # Ensure the user owns this session before retrieving messages
    if session.owner_id != user.id:
        return jsonify({"error": "You do not have permission to view messages in this session"}), 403 # Forbidden

    # Retrieve messages for this session
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

# ... (Rest of your app.py code) ...

# C:\Users\Ajinkya\Desktop\project\backend\app.py
# ... (Your existing get_chat_sessions route) ...

@app.route("/chat_sessions/<int:session_id>", methods=["DELETE"])
@jwt_required()
def delete_chat_session(session_id):
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    session = db.session.get(ChatSession, session_id)
    if not session:
        return jsonify({"error": "Chat session not found"}), 404

    # Permission check: Ensure the logged-in user is the owner of this session
    if session.owner_id != user.id:
        return jsonify({"error": "You do not have permission to delete this chat session"}), 403

    try:
        db.session.delete(session)
        db.session.commit()
        # Due to 'cascade="all, delete-orphan"' in ChatSession model,
        # all associated ChatMessages will also be deleted automatically.
        return jsonify({"msg": f"Chat session '{session.title}' and all its messages deleted successfully."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error deleting chat session: {e}")
        return jsonify({"error": "Error deleting chat session", "details": str(e)}), 500

# ... (Rest of your app.py code, including if __name__ == '__main__':) ...

# C:\Users\Ajinkya\Desktop\project\backend\app.py
# ... (Your existing chat message routes) ...

# --- Document Endpoints ---

@app.route("/documents", methods=["POST"])
@jwt_required()
def upload_document():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Check if a file was actually sent in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    # Check if the user selected a file
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        try:
            # Save the file to the upload folder
            file.save(filepath)

            # Get file size (in bytes)
            file_size_bytes = os.path.getsize(filepath)

            # Create a new Document record in the database
            new_document = Document(
                filename=filename,
                filepath=filepath,
                file_size_bytes=file_size_bytes,
                # If you added owner_id to Document, you'd set it here:
                owner_id=user.id
            )
            db.session.add(new_document)
            db.session.commit()
            
            

            return jsonify({
                "msg": "File uploaded successfully",
                "id": new_document.id,
                "filename": new_document.filename,
                "filepath": new_document.filepath,
                "upload_date": new_document.upload_date.isoformat(),
                "file_size_bytes": new_document.file_size_bytes
            }), 201
        except Exception as e:
            db.session.rollback()
            # Clean up the file if DB transaction fails
            if os.path.exists(filepath):
                os.remove(filepath)
            print(f"Error uploading document: {e}")
            return jsonify({"error": "Could not upload document", "details": str(e)}), 500
    else:
        return jsonify({"error": "File type not allowed"}), 400


# C:\Users\Ajinkya\Desktop\project\backend\app.py
# ... (Your existing document upload route: upload_document) ...

@app.route("/documents", methods=["GET"])
@jwt_required()
def list_documents():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id) # Retrieve the user object
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # *** THIS IS THE CORRECTED LINE ***
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

# ... (Rest of your app.py code) ...
@app.route("/documents/<int:document_id>", methods=["GET"])
@jwt_required()
def get_document_metadata(document_id):
    document = db.session.get(Document, document_id)
    if not document:
        return jsonify({"error": "Document not found"}), 404
    # You might want to add permission checks here if documents are user-specific
    if int(document.owner_id) != int(get_jwt_identity()):
        return jsonify({"error": "You do not have permission to view this document"}), 403
    return jsonify({
        "id": document.id,
        "filename": document.filename,
        "filepath": document.filepath,
        "upload_date": document.upload_date.isoformat(),
        "file_size_bytes": document.file_size_bytes
    }), 200

# C:\Users\Ajinkya\Desktop\project\backend\app.py
# ... (Your existing get_document_metadata route) ...

@app.route("/documents/<int:document_id>", methods=["DELETE"])
@jwt_required()
def delete_document(document_id):
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    document = db.session.get(Document, document_id)
    if not document:
        return jsonify({"error": "Document not found"}), 404

    # Permission check: Ensure the logged-in user is the owner of this document
    if document.owner_id != user.id:
        return jsonify({"error": "You do not have permission to delete this document"}), 403

    # Try to delete the physical file first
    try:
        if os.path.exists(document.filepath):
            os.remove(document.filepath)
            # print(f"DEBUG: Successfully deleted file from filesystem: {document.filepath}")
        else:
            # print(f"DEBUG: File not found on filesystem, proceeding with DB deletion: {document.filepath}")
            pass # File might have been manually deleted, proceed with DB record deletion

        # Delete the document record from the database
        db.session.delete(document)
        db.session.commit()
        return jsonify({"msg": f"Document '{document.filename}' and its record deleted successfully."}), 200

    except OSError as e:
        db.session.rollback() # Rollback any pending DB changes if file deletion fails
        print(f"Error deleting file from filesystem: {e}")
        return jsonify({"error": "Error deleting file from server storage", "details": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting document record: {e}")
        return jsonify({"error": "Error deleting document record from database", "details": str(e)}), 500

# ... (Rest of your app.py code, including if __name__ == '__main__':) ...

# ... (Rest of your app.py code, including if __name__ == '__main__':) ...

#Agent routes
#Agent route ends
from flask import Blueprint, request, jsonify
from werkzeug.datastructures import FileStorage
from services.query_service import process_query, process_documents

# bp = Blueprint('api', __name__)

# @bp.route("/upload/", methods=['POST'])
@app.route("/upload/",methods=['POST'])
async def upload():
    files = request.files.getlist('files')
    return await process_documents(files)

# @bp.route("/query/", methods=['POST'])
@app.route("/query/",methods=['POST'])
async def query():
    data = request.get_json()
    query_text = data.get('query', '')
    return await process_query(query_text)

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=8000,use_reloader=False)