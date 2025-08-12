from flask import jsonify
from werkzeug.exceptions import HTTPException
from utils.response_utils import error_response

def register_error_handlers(app):
    """
    Register global error handlers for the Flask app.
    
    Args:
        app: Flask application instance
    """
    
    @app.errorhandler(400)
    def bad_request(error):
        return error_response("Bad request", str(error), 400)
    
    @app.errorhandler(401)
    def unauthorized(error):
        return error_response("Unauthorized", "Authentication required", 401)
    
    @app.errorhandler(403)
    def forbidden(error):
        return error_response("Forbidden", "You don't have permission to access this resource", 403)
    
    @app.errorhandler(404)
    def not_found(error):
        return error_response("Not found", "The requested resource was not found", 404)
    
    @app.errorhandler(500)
    def internal_error(error):
        return error_response("Internal server error", "An unexpected error occurred", 500)
    
    @app.errorhandler(Exception)
    def handle_exception(error):
        if isinstance(error, HTTPException):
            return error_response(error.name, error.description, error.code)
        return error_response("Internal server error", str(error), 500)