from config.settings import Config

def allowed_file(filename):
    """
    Check if the uploaded file has an allowed extension.
    
    Args:
        filename (str): The name of the file to check
        
    Returns:
        bool: True if the file extension is allowed, False otherwise
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def get_file_size(filepath):
    """
    Get the size of a file in bytes.
    
    Args:
        filepath (str): Path to the file
        
    Returns:
        int: File size in bytes, or 0 if file doesn't exist
    """
    import os
    try:
        return os.path.getsize(filepath)
    except OSError:
        return 0

def validate_file_exists(filepath):
    """
    Validate that a file exists and is not empty.
    
    Args:
        filepath (str): Path to the file to validate
        
    Returns:
        tuple: (bool, str) - (is_valid, error_message)
    """
    import os
    if not os.path.exists(filepath):
        return False, "File does not exist"
    
    if os.path.getsize(filepath) == 0:
        return False, "File is empty"
    
    return True, ""