import os
from typing import List,Dict
from .colpali_client import ColpaliClient
from .qdrant_client import VectorDBClient


class MultiModalRAG:
    def __init__(self,url:str,api_key:str,image_dir:str=r"\data\pdf_images"):
        self.colpali=ColpaliClient()
        self.qdrant=VectorDBClient(url,api_key)
        self.collection='test'
        self.image_dir=image_dir
        self._init_collection()
        
    def _init_collection(self):
        '''
        Create collection if not present
        '''
        collections=self.qdrant._get_collections().collections
        if not any(col.name == self.collection for col in collections):
            print(f"[INFO] Creating collections...")
            self.qdrant.create_collection()
        else:
            print(f"[INFO] Collection already exists")
            
    def index_document(self,dataset:List[Dict]):
        '''
        Create embeddings of image and insert to the vectorDB
        '''
        try:
            print("[INFO] Preparing point structures for Qdrant...")
            points=self.qdrant.create_points(self.colpali,dataset)
            
            print("[INFO] Inserting data into Qdrant...")
            self.qdrant.insert_data(points,dataset)
        except Exception as e:
            print(f"Cannot add to vector DB:{e}")
            
    def query(self,query_text:str)->List[Dict]:
        query_embeddings=self.colpali.get_query_embeddings(query_text)
        
        print("[INFO] Performing vector search in Qdrant...")
        response=self.qdrant.search(user_query=query_embeddings)
        
        # Extract points from QueryResponse object
        results = response.points if hasattr(response, 'points') else []
        print(f"[INFO] Found {len(results)} matching results")
        
        return results
