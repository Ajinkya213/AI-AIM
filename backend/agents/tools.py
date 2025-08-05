"""
Tools Module

Custom CrewAI tools for web search and document retrieval functionality.
Provides integration with Tavily search API and local RAG system.
"""
from crewai.tools import tool
from tavily import TavilyClient
import os
from core.rag_singleton import rag 

#Variable for Tavily API key
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY") or "your-tavily-api-key"

@tool("Web Search Tool")
def search_web(query: str) -> str:
    """
    Search the web using Tavily API.
    
    Args:
        query (str): Search query string
        
    Returns:
        str: Combined search results or error message
    """
    client = TavilyClient(api_key=TAVILY_API_KEY)
    try:
        results = client.search(query=query, max_results=3)
        return "\n".join([r["content"] for r in results["results"]])
    except Exception as e:
        return f"Search failed: {e}"

@tool("Document Retrival tool")
def retrive_from_document(query:str)->str:
    """
    Retrieve relevant content from local document database.
    
    Uses the RAG singleton to search through indexed documents
    and return matching content based on semantic similarity.
    
    Args:
        query (str): User query for document search
        
    Returns:
        str: Retrieved document content or status message
    """
    try:
        result=rag.generate_result(query)
        if result['status']=="success":
            return result
        elif result['status']=="no_results":
            return result['message']
        else:
            return f"Error: {result['message']}"
    except Exception as e:
        return f"Retrival failed: {e}"
    