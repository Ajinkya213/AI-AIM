// components/userboard/MainContent.tsx
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatTab } from "./ChatTab";
import { FileLibraryTab } from "./FileLibraryTab";
import { v4 as uuidv4 } from 'uuid';

interface MainContentProps {
  currentQueryId?: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // e.g., "application/pdf", "image/jpeg"
  uploadDate: string; // e.g., "2025-07-27"
  status: "pending" | "uploading" | "completed" | "failed";
  progress?: number; // 0-100
}

export function MainContent({ currentQueryId }: MainContentProps) {
  const [chatMessages, setChatMessages] = React.useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);

  // Function to get current timestamp
  const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Simulate sending a message and getting an AI response
  const handleSendMessage = (messageText: string) => {
    const newUserMessage: Message = {
      id: uuidv4(),
      text: messageText,
      sender: "user",
      timestamp: getTimestamp(),
    };
    setChatMessages((prev) => [...prev, newUserMessage]);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        text: `AI response to "${messageText}" for query ${currentQueryId || "N/A"}.`,
        sender: "ai",
        timestamp: getTimestamp(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  // Simulate file upload
  const handleFileUpload = (file: File) => {
    const newFile: UploadedFile = {
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      status: "uploading",
      progress: 0,
    };
    setUploadedFiles((prev) => [...prev, newFile]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, progress, status: "uploading" } : f)),
        );
      } else {
        clearInterval(interval);
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, status: "completed", progress: 100 } : f)),
        );
        console.log(`File "${file.name}" uploaded for query ${currentQueryId}`);
      }
    }, 100); // Simulate 10% progress every 100ms
  };

  // Simulate file deletion
  const handleFileDelete = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    console.log(`File ${fileId} deleted.`);
  };


  // Optional: Reset chat/files when currentQueryId changes (simulating per-query context)
  React.useEffect(() => {
    if (currentQueryId) {
        // In a real app, you'd load chat history and file list for this specific query
        setChatMessages([
            { id: uuidv4(), text: `Hello! This is a chat for query: ${currentQueryId}`, sender: "ai", timestamp: getTimestamp() },
        ]);
        setUploadedFiles([]); // Start with empty files for a new query context
    } else {
        setChatMessages([]);
        setUploadedFiles([]);
    }
  }, [currentQueryId]);


  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">
          {currentQueryId ? `Current Query: ${currentQueryId}` : "Userboard Main Panel"}
        </h1>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="chat" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent">
            Chat
          </TabsTrigger>
          <TabsTrigger value="files" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent">
            File Library
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
          <ChatTab
            currentChatMessages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        </TabsContent>
        <TabsContent value="files" className="flex-1 overflow-hidden mt-0">
          <FileLibraryTab
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}