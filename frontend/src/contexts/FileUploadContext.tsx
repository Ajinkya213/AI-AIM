import React, { createContext, useContext, useState, useCallback } from "react";

interface UploadedDocument {
  id: number;
  filename: string;
  filepath: string;
  upload_date: string;
  file_size_bytes: number;
  processing_result?: any;
}

interface UploadingFile {
  id: string; // temporary id
  name: string;
  size: number;
  type: string;
}

interface UploadProgress {
  [key: string]: number; // file name -> progress percentage
}

interface FileUploadContextType {
  documents: UploadedDocument[];
  uploadingFiles: UploadingFile[];
  isUploading: boolean;
  uploadProgress: UploadProgress;
  error: string | null;
  uploadDocument: (file: File) => Promise<void>;
  fetchDocuments: () => Promise<void>;
  deleteDocument: (id: string | number) => Promise<void>;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export const useFileUpload = () => {
  const ctx = useContext(FileUploadContext);
  if (!ctx) throw new Error("useFileUpload must be used within FileUploadProvider");
  return ctx;
};

export const FileUploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "http://localhost:8000";

  const getAuthToken = () => localStorage.getItem("access_token");

  const uploadDocument = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    // Create a temporary uploading file
    const tempFile: UploadingFile = {
      id: `temp-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
    };
    
    setUploadingFiles(prev => [...prev, tempFile]);
    setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setIsUploading(false);
      setUploadingFiles(prev => prev.filter(f => f.id !== tempFile.id));
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("Not authenticated.");
      setIsUploading(false);
      setUploadingFiles(prev => prev.filter(f => f.id !== tempFile.id));
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          if (currentProgress < 90) {
            return { ...prev, [file.name]: currentProgress + 10 };
          }
          return prev;
        });
      }, 200);

      const response = await fetch(`${API_BASE}/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to upload document");
      }

      const data = await response.json();
      
      // Set progress to 100% when complete
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      
      // Add to documents list
      setDocuments(prev => [data, ...prev]);
      
      // Remove from uploading files and clear progress after a short delay
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.id !== tempFile.id));
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Failed to upload document");
      setUploadingFiles(prev => prev.filter(f => f.id !== tempFile.id));
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const fetchDocuments = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Not authenticated.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch documents");
      const docs = await response.json();
      setDocuments(docs);
    } catch (err: any) {
      setError(err.message || "Failed to fetch documents");
    }
  }, []);

  const deleteDocument = useCallback(async (id: string | number) => {
    const token = getAuthToken();
    if (!token) {
      setError("Not authenticated.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/documents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete document");
      setDocuments(prev => prev.filter(doc => doc.id.toString() !== id.toString()));
    } catch (err: any) {
      setError(err.message || "Failed to delete document");
    }
  }, []);

  return (
    <FileUploadContext.Provider
      value={{ documents, uploadingFiles, isUploading, uploadProgress, error, uploadDocument, fetchDocuments, deleteDocument }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};