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
        '''
        Creates points containing all the metadata for image and its vectors to insert to qdrant DB
        '''
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
            print(f"[INFO] Created {len(points)} points.")
            return points
    
    def insert_data(self,points:List,dataset:List[Dict],batch_size:int=5,collection_name:str='test')->None:
        '''
        Upsert points data to the collection 
        '''
        for i in range(0,len(dataset),batch_size):
            batch_points=points[i:i+batch_size]
            try:
                self.client.upsert(
                    collection_name=collection_name,
                    points=batch_points,
                    wait=True
                )
                print(f"[INFO] Inserted {len(batch_points)} points.")
            except Exception as e:
                print(f"[ERROR] An Error occured during insertion: {e}")
                continue
        print(f"[INFO] Data inserted successfully")
        
    def search(self,user_query:List,collection_name:str='test')->List:
        '''
        Search and retrive the points which match the user query 
        '''
        result=self.client.query_points(
            collection_name=collection_name,
            query=user_query,
            limit=5,
            search_params=models.SearchParams(
                quantization=models.QuantizationSearchParams(
                    ignore=True,
                    rescore=True,
                    oversampling=2.0
                )
            )
        )
        return result
        