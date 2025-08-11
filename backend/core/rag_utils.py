import os
from typing import List,Dict, Tuple
from PIL import Image
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
        '''
        Creates query embeddings and search relevent images based on user query
        '''
        query_embeddings=self.colpali.get_query_embeddings(query_text)
        
        print("[INFO] Performing vector search in Qdrant...")
        response=self.qdrant.search(user_query=query_embeddings)
        
        results = response.points if hasattr(response, 'points') else []
        print(f"[INFO] Found {len(results)} matching results")
        
        return results
    
    def get_result_images(self,search_result:List,dataset:List[Dict]=None)->List[Tuple[Image.Image,Dict]]:        
        retrieved_images=[]
        for result in search_result:
            if hasattr(result, 'payload'):
                payload = result.payload
                score = result.score
            else:
                payload = result.get("payload", {})
                score = result.get('score', 0)
                
            doc_id=payload.get("doc_id")
            page_num=payload.get("page_num")
            filename=payload.get("source")
            
            # Construct image path from metadata
            pdf_name_without_ext = filename.replace('.pdf', '')
            image_filename = f"doc_{doc_id}_page_{page_num}_{pdf_name_without_ext}.png"
            image_path = os.path.join(self.image_dir, image_filename)  # Use your actual image directory
            
            try:
                # Load image from disk
                image = Image.open(image_path)
                metadata = {
                    'doc_id': doc_id,
                    'page_number': page_num,
                    'filename': filename,
                    'score': score
                }
                retrieved_images.append((image, metadata))
                print(f"[INFO] Retrieved image: {filename}, page {page_num}, score: {score:.3f}")
            except FileNotFoundError:
                print(f"[WARNING] Image file not found: {image_path}")
            except Exception as e:
                print(f"[ERROR] Failed to load image {image_path}: {e}")
        
        return retrieved_images
    
    def search_and_retrieve(self, query_text: str, top_k: int = 5) -> List[Tuple[Image.Image, Dict]]:
        # Get search results
        search_results = self.query(query_text)
        
        # Limit results if needed
        if top_k and len(search_results) > top_k:
            search_results = search_results[:top_k]
        
        # Retrieve corresponding images
        retrieved_images = self.get_result_images(search_results)
        
        print(f"[INFO] Retrieved {len(retrieved_images)} images for query: '{query_text}'")
        return retrieved_images