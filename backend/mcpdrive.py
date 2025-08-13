from mcp.server.fastmcp import FastMCP

# Create an MCP server
mcp = FastMCP("google_drive")


# Add an addition tool
@mcp.tool()
def google_drive_tool(folder_id:str):
    """
    This tool interacts with Google Drive to fetch pdf files in given Google Drive folder ID.

    Args:
        folder_id (str): The ID of the Google Drive folder to list files from.
    
    Returns:
        list: A list of file names in the specified folder.
    """
