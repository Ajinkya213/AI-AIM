import os
from typing import List,Dict,Tuple
from PIL import Image
from .colpali_client import ColpaliClient
from .qdrant_client import VectorDBClient
import google.generativeai as genai


class MultiModalRAG:
    def __init__(self,url:str,api_key:str,image_dir:str=r"\data\pdf_images"):
        self.colpali=ColpaliClient()
        self.qdrant=VectorDBClient(url,api_key)
        self.collection='test'
        self.image_dir=image_dir
        self._init_collection()
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=GEMINI_API_KEY)
        self.model=genai.GenerativeModel('gemini-2.5-flash')
        
        print("[INFO] MultiModalRAG initialized successfully")
        
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
        '''
        Extract information from the retrived point
        '''
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
        """
        Search for relevant pages and retrieve their images
        """
        # Get search results
        search_results = self.query(query_text)
        
        # Limit results if needed
        if top_k and len(search_results) > top_k:
            search_results = search_results[:top_k]
        
        # Retrieve corresponding images
        retrieved_images = self.get_result_images(search_results)
        
        print(f"[INFO] Retrieved {len(retrieved_images)} images for query: '{query_text}'")
        return retrieved_images
    
    def prepare_for_gemini(self, retrieved_images: List[Tuple[Image.Image, Dict]]) -> List[Image.Image]:
        """
        Extract just the images for sending to Gemini
        """
        return [image for image, metadata in retrieved_images]
    
    def evaluate_retrieval_quality(self, retrieved_images: List[Tuple[Image.Image, Dict]], query: str) -> Dict:
        """
        Evaluate if the retrieved documents are sufficient to answer the query
        """
        if not retrieved_images:
            return {
                "sufficient": False,
                "confidence": "none",
                "reason": "No documents retrieved"
            }
        
        # Simple heuristic: check average score and number of results
        avg_score = sum(metadata['score'] for _, metadata in retrieved_images) / len(retrieved_images)
        
        if avg_score > 0.8 and len(retrieved_images) >= 2:
            return {"sufficient": True, "confidence": "high", "reason": "High relevance scores"}
        elif avg_score > 0.6 and len(retrieved_images) >= 1:
            return {"sufficient": True, "confidence": "medium", "reason": "Moderate relevance scores"}
        else:
            return {"sufficient": False, "confidence": "low", "reason": "Low relevance scores"}
        
    def generate_result(self, query_text: str) -> Dict:
        """
        Complete RAG workflow: search, retrieve images, and get response from Gemini
        Returns structured result with metadata
        """
        try:
            # Search and retrieve images
            retrieved_images = self.search_and_retrieve(query_text)
            
            # Evaluate retrieval quality
            evaluation = self.evaluate_retrieval_quality(retrieved_images, query_text)
            
            if not retrieved_images:
                return {
                    "status": "no_results",
                    "message": "No relevant documents found for the query",
                    "gemini_response": None,
                    "retrieved_pages": 0,
                    "metadata": [],
                    "evaluation": evaluation
                }
            
            image_metadata_list = [metadata for _, metadata in retrieved_images]
            
            # Prepare images for Gemini
            gemini_images = self.prepare_for_gemini(retrieved_images)
            
            # Create prompt for Gemini
            prompt = f"""
                You are an AI model specialized in image analysis and question answering.
                Carefully analyze the image(s) as well as the metadata related to it and answer the query.

                Query:
                {query_text}

                Metadata from Images:
                {image_metadata_list}

                Instructions:
                - Return your answer in the following JSON format:
                [
                {{
                    "response": "<your detailed answer>",
                    "page_number": <page number>,
                    "document_name": "<document name>",
                    "confidence": "<high/medium/low>"
                }}
                ]
                If multiple pages are relevant, return a list of such objects.
                If no answer is found, return:
                [{{"response": "No relevant information found in the retrieved documents.", "page_number": null, "document_name": null, "confidence": "low"}}]
            """
            
            # Get response from Gemini
            chat = self.model.start_chat()
            response = chat.send_message([prompt, *gemini_images])
            
            return {
                "status": "success",
                "gemini_response": response.text,
                "retrieved_pages": len(retrieved_images),
                "metadata": image_metadata_list,
                "evaluation": evaluation
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"Error during RAG process: {str(e)}",
                "gemini_response": None,
                "retrieved_pages": 0,
                "metadata": [],
                "evaluation": {"sufficient": False, "confidence": "none", "reason": "Error occurred"}
            }