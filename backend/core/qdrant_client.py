import qdrant_client
from typing import List,Dict
from qdrant_client.http import models
from .colpali_client import ColpaliClient


class VectorDBClient:
    def __init__(self,url:str,api_key:str):
        self.client=qdrant_client.QdrantClient(
            url=url,
            api_key=api_key
        )
        
    def _get_client_info(self):
        '''
        Get info of the client
        '''
        return self.client.info()
    
    def _get_collections(self):
        '''
        List all the collections in the cluster
        '''
        return self.client.get_collections()
    
    def create_collection(self,name:str='test',vector_size:int=128)->None:
        '''
        Creates a collection with the given name and vextor size
        '''
        self.client.create_collection(
            collection_name=name,
            on_disk_payload=True,
            vectors_config=models.VectorParams(
                size=vector_size,
                distance=models.Distance.COSINE,
                on_disk=True,
                multivector_config=models.MultiVectorConfig(
                    comparator=models.MultiVectorComparator.MAX_SIM
                ),
            ),
        )
    
    def create_points(self,colpali_client: ColpaliClient,dataset:List[Dict],batch_size:int=5)->List:
        points=[]
        for i in range(0,len(dataset),batch_size):
            batch=dataset[i:i+batch_size]
            images=[item['image'] for item in batch]
            
            image_embeddings=colpali_client.get_image_embeddings(images)
            for j,embedding in enumerate(image_embeddings):
                points.append(
                    models.PointStruct(
                        id=i+j,
                        vector=embedding, #add tolist if need
                        payload={
                            "doc_id": batch[j]["doc_id"],
                            "page_num": batch[j]["page_number"],
                            "source": batch[j]['filename']
                        },
                    )
                )
            return points