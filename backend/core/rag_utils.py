from .colpali_client import ColpaliClient
from .qdrant_client import VectorDBClient
import os

class MultiModalRAG:
    def __init__(self,url:str,api_key:str,image_dir:str=r"D:\Projects\CDAC Project\test_with_ai\data\pdf_images"):
        self.colpali=ColpaliClient()
        self.qdrant=VectorDBClient(url,api_key)
        self.collection='test'
        self.image_dir=image_dir
        self._init_collection()
        
    def _init_collection(self):
        collections=self.qdrant._get_collections().collections
        if not any(col.name == self.collection for col in collections):
            print(f"[INFO] Creating collections...")
            self.qdrant.create_collection()
        else:
            print(f"[INFO] Collection already exists")
