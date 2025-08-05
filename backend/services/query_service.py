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
    all_data = []
    for file_item in files:
        if isinstance(file_item, str):
            # If file_item is a file path (string), use it directly
            file_path = file_item
            # Verify the file exists
            if not os.path.exists(file_path):
                print(f"Warning: File not found at path: {file_path}")
                continue
        else:
            # If file_item is a FileStorage object, save it to temp location first
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, file_item.filename)
            
            # Save uploaded file to temporary location
            file_item.save(temp_path)
            file_path = temp_path
        
        try:
            # Convert PDF to structured data using the file path
            data = converter.convert(file_path)
            all_data.extend(data)
            
            # Clean up temporary file if it was created
            if isinstance(file_item, FileStorage) and os.path.exists(temp_path):
                os.unlink(temp_path)
                
        except Exception as e:
            print(f"Error processing file {file_path}: {e}")
            # Clean up temporary file if it was created
            if isinstance(file_item, FileStorage) and os.path.exists(temp_path):
                os.unlink(temp_path)
            continue
    
    # Index all processed documents in RAG system
    if all_data:
        rag.index_document(all_data)
        return {"status": f"Documents processed and indexed. Processed {len(all_data)} pages."}
    else:
        return {"status": "No documents were successfully processed."}

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