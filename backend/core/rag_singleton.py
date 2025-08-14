from core.rag_utils import MultiModalRAG
from config.settings import QDRANT_URL, QDRANT_API_KEY

class RAGSingleton:
    _instance=None
    _initialized=False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance=super(RAGSingleton,cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not RAGSingleton._initialized:
            print("[INFO] Initializing RAG ...")
            self._rag=MultiModalRAG(url=QDRANT_URL,api_key=QDRANT_API_KEY)
            RAGSingleton._initialized=True
            print("[INFO] RAG singleton initialized successfully")
    
    def get_rag(self):
        return self._rag
    
    def __getattr__(self, name):
        return getattr(self._rag,name)
    
rag=RAGSingleton()