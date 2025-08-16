from flask import jsonify

def success_response(data=None, message="Success", status_code=200):
    """
    Create a standardized success response.
    
    Args:
        data: The data to include in the response
        message (str): Success message
        status_code (int): HTTP status code
        
    Returns:
        tuple: (json_response, status_code)
    """
    response = {
        "success": True,
        "message": message
    }
    
    if data is not None:
        response["data"] = data
    
    return jsonify(response), status_code

def error_response(message="Error", details=None, status_code=400):
    """
    Create a standardized error response.
    
    Args:
        message (str): Error message
        details: Additional error details
        status_code (int): HTTP status code
        
    Returns:
        tuple: (json_response, status_code)
    """
    response = {
        "success": False,
        "error": message
    }
    
    if details is not None:
        response["details"] = details
    
    return jsonify(response), status_code

def paginated_response(data, page, per_page, total, message="Success"):
    """
    Create a standardized paginated response.
    
    Args:
        data: The data for the current page
        page (int): Current page number
        per_page (int): Number of items per page
        total (int): Total number of items
        message (str): Success message
        
    Returns:
        tuple: (json_response, status_code)
    """
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