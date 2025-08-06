// components/userboard/MainContent.tsx
import React from "react";
import { ChatTab } from "./ChatTab";
import { FileLibraryTab } from "./FileLibraryTab";
import { useChat } from "../../contexts/ChatContext";
import type { ChatMessage } from "../../contexts/ChatContext";

interface MainContentProps {
  // Removed currentSession prop since we get it from context
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  status: "pending" | "uploading" | "completed" | "failed";
  progress?: number; // 0-100
}

export function MainContent({ }: MainContentProps) {
  const { addMessage, addSession, currentSession: session } = useChat();

  // Use the session from context
  const activeSession = session;
  const activeMessages = activeSession?.messages || [];
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const [isSendingMessage, setIsSendingMessage] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"chat" | "files">("chat");

  // Enhanced AI response simulation with different response types
  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      `I understand you said: "${userMessage}". This is a helpful AI response that demonstrates the chat functionality.`,
      `Thanks for your message: "${userMessage}". I'm here to help with any questions you might have.`,
      `Interesting point about "${userMessage}". Let me provide some insights on this topic.`,
      `I've processed your message: "${userMessage}". Here's what I think about this.`,
      `Great question! Regarding "${userMessage}", here's my analysis.`
    ];

    // Add some variety based on message content
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello! How can I assist you today?";
    }
    if (userMessage.toLowerCase().includes('help')) {
      return "I'm here to help! What specific assistance do you need?";
    }
    if (userMessage.toLowerCase().includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Enhanced message sending with better error handling
  const handleSendMessage = async (messageText: string) => {
    if (!activeSession) {
      console.error('No active session');
      // Try to create a new session if none exists
      try {
        const newSession = await addSession();
        if (newSession) {
          // Add user message to new session
          await addMessage(newSession.id, messageText, true);

          // Simulate AI response after a short delay
          setTimeout(async () => {
            try {
              const aiResponse = generateAIResponse(messageText);
              await addMessage(newSession.id, aiResponse, false);
            } catch (error) {
              console.error('Failed to add AI response:', error);
              // Show user-friendly error
              await addMessage(newSession.id, "Sorry, I encountered an error processing your message. Please try again.", false);
            }
          }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds for realism
        }
      } catch (error) {
        console.error('Failed to create session or send message:', error);
      }
      return;
    }

    setIsSendingMessage(true);
    try {
      // Add user message
      await addMessage(activeSession.id, messageText, true);

      // Simulate AI response after a short delay
      setTimeout(async () => {
        try {
          const aiResponse = generateAIResponse(messageText);
          await addMessage(activeSession.id, aiResponse, false);
        } catch (error) {
          console.error('Failed to add AI response:', error);
          // Show user-friendly error
          await addMessage(activeSession.id, "Sorry, I encountered an error processing your message. Please try again.", false);
        }
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds for realism
    } catch (error) {
      console.error('Failed to send message:', error);
      // Could show a toast notification here
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Enhanced file upload simulation
  const handleFileUpload = (file: File) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString().split('T')[0],
      status: "uploading",
      progress: 0
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === newFile.id) {
          const newProgress = Math.min(f.progress! + 10, 100);
          return { ...f, progress: newProgress };
        }
        return f;
      }));
    }, 100);

    // Clear interval when upload is complete
    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === newFile.id) {
          return { ...f, status: "completed", progress: 100 };
        }
        return f;
      }));
    }, 1000);
  };

  // Handle file deletion
  const handleFileDelete = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "chat"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "files"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Files
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" ? (
          <ChatTab
            currentChatMessages={activeMessages}
            onSendMessage={handleSendMessage}
            isSending={isSendingMessage}
          />
        ) : (
          <FileLibraryTab
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
          />
        )}
      </div>
    </div>
  );
}