from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from model.user import User
from config.database import db, pwd_context
from config.settings import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/login", methods=["POST","OPTIONS"])
def login():
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        return response

    username = request.json.get("username", None)
    password = request.json.get("password", None)

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not user.verify_password(password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token), 200

@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    token_id = get_jwt()["jti"]
    Config.blocklist.add(token_id)
    return jsonify(msg="Successfully logged out"), 200

@auth_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(logged_in_as=user.username, message="You accessed a protected route!"), 200