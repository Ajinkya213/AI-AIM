from flask import jsonify

def success_response(data=None, message="Success", status_code=200):
    response = {
        "success": True,
        "message": message
    }
    
    if data is not None:
        response["data"] = data
    
    return jsonify(response), status_code

def error_response(message="Error", details=None, status_code=400):
    response = {
        "success": False,
        "error": message
    }
    
    if details is not None:
        response["details"] = details
    
    return jsonify(response), status_code

def paginated_response(data, page, per_page, total, message="Success"):
    total_pages = (total + per_page - 1) // per_page
    
    response = {
        "success": True,
        "message": message,
        "data": data,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }
    
    return jsonify(response), 200