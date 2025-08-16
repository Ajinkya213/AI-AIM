# gdrive_server.py
import os
from typing import List, Dict
from mcp.server.fastmcp import FastMCP
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Google Drive API scope (read-only)
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

mcp = FastMCP("Google Drive PDFs", instructions="List and fetch PDFs from Google Drive folders.")

def get_drive_service():
    """Authenticate and return a Google Drive API service."""
    creds = None
    token_path = os.environ.get("GDRIVE_TOKEN_PATH", "token.json")
    client_config = os.environ.get("GOOGLE_OAUTH_CLIENT_CONFIG", "client_secret.json")

    # Load existing token
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    # If no valid creds, run the OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(client_config, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save creds for next run
        with open(token_path, "w") as token_file:
            token_file.write(creds.to_json())

    return build("drive", "v3", credentials=creds)

@mcp.tool()
def list_pdfs_in_folder(folder_id: str) -> List[Dict]:
    """
    List all PDF files in a Google Drive folder.
    Args:
        folder_id: The Google Drive folder ID
    Returns:
        List of dicts with file name and ID
    """
    service = get_drive_service()
    query = f"'{folder_id}' in parents and mimeType='application/pdf' and trashed=false"
    results = service.files().list(
        q=query,
        fields="files(id, name, mimeType)"
    ).execute()

    files = results.get("files", [])
    return [{"id": f["id"], "name": f["name"]} for f in files]

@mcp.resource("gdrive-pdf://{file_id}")
def get_pdf(file_id: str):
    """Return the actual PDF file from Google Drive."""
    import base64
    
    try:
        service = get_drive_service()
        request = service.files().get_media(fileId=file_id)
        pdf_bytes = request.execute()

        # Encode binary data as base64 for JSON transport
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')

        return {
            "contents": [
                {
                    "uri": f"gdrive-pdf://{file_id}",
                    "mimeType": "application/pdf",
                    "blob": pdf_base64
                }
            ]
        }
    except Exception as e:
        # Return error information for debugging
        return {
            "contents": [
                {
                    "uri": f"gdrive-pdf://{file_id}",
                    "mimeType": "text/plain",
                    "text": f"Error fetching PDF: {str(e)}"
                }
            ]
        }