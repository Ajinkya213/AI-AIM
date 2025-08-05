import torch
from PIL import Image
from typing import List
from colpali_engine.models import ColPali,ColPaliProcessor

class ColpaliClient:
    def __init__(self,model_name:str='vidore/colpali-v1.3',cache_dir:str="./model_cache"):
        device='cuda' if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
        self.device=device
        
        self.model=ColPali.from_pretrained(
            pretrained_model_name_or_path=model_name,
            torch_dtype=torch.bfloat16,
            device_map=self.device,
            cache_dir=cache_dir,
            low_cpu_mem_usage=True #remove this
        )
        
        self.processor=ColPaliProcessor.from_pretrained(
            pretrained_model_name_or_path=model_name,
            cache_dir=cache_dir
        )
    
    def get_image_embeddings(self,images:List)->List[List[float]]:
        '''
        Creates embeddings for the given image or list of images using Colpali
        '''
        with torch.no_grad():
            image_inputs=self.processor.process_images(images).to(self.model.device)
            image_embeddings=self.model(**image_inputs)
        embeddings=[embedding.cpu().float().numpy().tolist() for embedding in image_embeddings]
        return embeddings
        
    def get_query_embeddings(self,query:str)->List:
        '''
        Creates embeddings for the given text query or list of queries using Colpali
        '''
        with torch.no_grad():
            text_embeddings=self.processor.process_queries([query]).to(self.model.device)
            text_embeddings=self.model(**text_embeddings)
        query_embeddings=text_embeddings[0].cpu().float().numpy().tolist()
        return query_embeddings