// components/userboard/ChatTab.tsx
import * as React from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./ChatMessage";
import { type ChatMessage as ChatMessageType } from "@/contexts/ChatContext";

interface ChatTabProps {
  currentChatMessages: ChatMessageType[];
  onSendMessage: (message: string) => Promise<void>;
  isSending?: boolean;
}

export function ChatTab({ currentChatMessages, onSendMessage, isSending = false }: ChatTabProps) {
  const [inputMessage, setInputMessage] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isSending) {
      try {
        await onSendMessage(inputMessage.trim());
        setInputMessage("");
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isSending) {
      event.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  React.useEffect(() => {
    // Scroll to the bottom of the chat view when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatMessages]);

  // Convert ChatMessageType to the format expected by ChatMessage component
  const formatMessageForDisplay = (msg: ChatMessageType) => ({
    id: msg.id,
    content: msg.content,
    is_user_message: msg.is_user_message,
    timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  });

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 pr-6 overflow-y-auto">
        <div className="space-y-4">
          {currentChatMessages.length === 0 ? (
            <div className="text-center text-muted-foreground pt-10">
              Start a new conversation!
            </div>
          ) : (
            currentChatMessages.map((msg) => (
              <ChatMessage key={msg.id} message={formatMessageForDisplay(msg)} />
            ))
          )}
          <div ref={messagesEndRef} /> {/* Dummy div to scroll to */}
        </div>
      </ScrollArea>
      <div className="border-t p-4 flex items-center gap-2">
        <Textarea
          placeholder={isSending ? "Sending message..." : "Type your message here..."}
          className="flex-1 resize-none"
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={isSending || !inputMessage.trim()}
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <PaperPlaneIcon className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isSending ? "Sending message" : "Send message"}
          </span>
        </Button>
      </div>
    </div>
  );
}