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