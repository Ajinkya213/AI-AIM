"""
Tasks Module

This module contains task creation and execution logic for CrewAI agents.
It handles the creation of dynamic tasks that attempt local document retrieval
first, then fallback to web search if no relevant information is found.
"""
from crewai import Task
from core.rag_singleton import rag
from agents.agents import agent

def build_task(query: str):
    """
    Build a CrewAI task for document retrieval and web search fallback.
    
    This function creates a task that first attempts to retrieve information
    from local documents using the RAG system. If no relevant information
    is found, it triggers a fallback to web search.
    
    Args:
        query (str): The user query to search for
        dataset (list): List of documents/data sources (currently unused but 
                       kept for future extensibility)
    
    Returns:
        Task: A CrewAI Task object configured with the retrieval logic
    
    Example:
        >>> task = build_task("What is machine learning?", [])
        >>> # Task will first search local documents, then web if needed
    """
    def task_logic(_):
        """
        Internal task execution logic.
        
        Attempts to retrieve information from local RAG system first.
        If no results are found or results indicate no relevant information,
        returns a fallback indicator to trigger web search.
        
        Args:
            _: Unused parameter (required by CrewAI task signature)
            
        Returns:
            str: Either the RAG results or a fallback indicator
        """
        results = rag.generate_result(query) # Attempt to retrieve information from local documents using RAG
        # Check if RAG found relevant information
        if results['status'] == 'no_results' or "No relevant information found" in str(results):
            # Trigger fallback to web search by returning special format
            return f"fallback:{query}"
        return results

    return Task(
        description=f"Retrieve info about: {query}",
        expected_output="A JSON response answering the query.",
        agent=agent,# Assign the multimodal retrieval agent
        steps=[task_logic]# Define the execution steps
    )