import os
from typing import List,Dict,Union
from pdf2image import convert_from_path

class PdfConverter:
    def __init__(self,image_dir=None):
        if image_dir is None:
            # Create pdf_images folder inside uploads directory
            uploads_dir = os.path.join(os.getcwd(), 'uploads')
            self.saved_images_dir = os.path.join(uploads_dir, 'pdf_images')
        else:
            self.saved_images_dir = image_dir
        os.makedirs(self.saved_images_dir,exist_ok=True)
        os.environ["TOKENIZERS_PARALLELISM"]="false"
        self._doc_counter=1
        
    def pdf_to_image(self,file_path:str)->List[Dict]:
        pdf_name=os.path.basename(file_path)
        try:
            images=convert_from_path(file_path,poppler_path=r"C:\Program Files\poppler-24.08.0\Library\bin") #change to pdf_path
        except Exception as e:
            print(f"[ERROR] Failed to convert {pdf_name}: {e}")
            return []
        
        results=[]
        for page_num,image in enumerate(images):
            image_filename = f"doc_{self._doc_counter}_page_{page_num+1}_{pdf_name.replace('.pdf', '')}.png"
            image_path = os.path.join(self.saved_images_dir, image_filename)
            image.convert('RGB').save(image_path)
            
            results.append({
                "doc_id":self._doc_counter,
                "filename":pdf_name,
                "page_number":page_num+1,
                "image_path":image_path,
                "image":image.convert('RGB')
            })
        self._doc_counter+=1
        return results