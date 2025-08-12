import os
from tavily import TavilyClient

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY") or "your-tavily-api-key"

def search_web(query: str) -> str:
    client = TavilyClient(api_key=TAVILY_API_KEY)
    try:
        results = client.search(query=query, max_results=3)
        return "\n".join([r["content"] for r in results["results"]])
    except Exception as e:
        return f"Search failed: {e}"