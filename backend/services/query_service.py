"""
Query Service Module

This module provides services for document processing and query handling.
It integrates PDF conversion, RAG indexing, and CrewAI agent execution
to process user documents and answer queries.
"""
import tempfile
import os
from werkzeug.datastructures import FileStorage
from typing import List
from core.utils import PdfConverter
from core.rag_singleton import rag  
from agents.agents import agent
from agents.tasks import build_task
from crewai import Crew

# Initialize PDF converter instance
converter = PdfConverter()

async def process_documents(files: List[FileStorage]):
    """
    Process and index uploaded PDF documents.
    
    This function handles file upload, conversion to text, and indexing
    into the RAG system for future retrieval.
    
    Args:
        files (List[FileStorage]): List of uploaded PDF files
        
    Returns:
        Dict[str, str]: Status message indicating processing completion
        
    Raises:
        Exception: If file processing or indexing fails
    """
    all_data = []
    for file in files:
        # Create temporary file path for processing
        temp_dir=tempfile.gettempdir()
        temp_path=os.path.join(temp_dir,file.filename)
        
        # Save uploaded file to temporary location
        file.save(temp_path)
        
        # Convert PDF to structured data
        data = converter.convert(temp_path)
        all_data.extend(data)
        
        # Clean up temporary file
        os.unlink(temp_path)
    # Index all processed documents in RAG system
    rag.index_document(all_data)
    return {"status": "Documents processed and indexed."}

async def process_query(query: str):
    """
    Process user query using CrewAI agents and RAG system.
    
    Creates a task for the agent to handle the query, which will first
    attempt local document retrieval and fallback to web search if needed.
    
    Args:
        query (str): User's question or search query
        
    Returns:
        Dict[str, str]: Response containing the answer to the query
    """
    task = build_task(query)
    # Create crew with our multimodal agent
    crew = Crew(agents=[agent], tasks=[task])
    
    # Execute the task and get results
    result = crew.kickoff()
    
    if hasattr(result, 'raw'):
        response_text = str(result.raw)
    elif hasattr(result, 'result'):
        response_text = str(result.result)
    else:
        response_text = str(result)
    
    return {"response": response_text}