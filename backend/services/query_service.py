import tempfile
import os
from werkzeug.datastructures import FileStorage
from typing import List
from core.utils import PdfConverter
from core.rag_singleton import rag  

converter = PdfConverter()

async def process_documents(files: List[FileStorage]):
    all_data = []
    for file_item in files:
        if isinstance(file_item, str):
            file_path = file_item
            if not os.path.exists(file_path):
                print(f"Warning: File not found at path: {file_path}")
                continue
        else:
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, file_item.filename)
            
            file_item.save(temp_path)
            file_path = temp_path
        
        try:
            data = converter.convert(file_path)
            all_data.extend(data)
            
            if isinstance(file_item, FileStorage) and os.path.exists(temp_path):
                os.unlink(temp_path)
                
        except Exception as e:
            print(f"Error processing file {file_path}: {e}")
            if isinstance(file_item, FileStorage) and os.path.exists(temp_path):
                os.unlink(temp_path)
            continue
    
    if all_data:
        rag.index_document(all_data)
        return {"status": f"Documents processed and indexed. Processed {len(all_data)} pages."}
    else:
        return {"status": "No documents were successfully processed."}
