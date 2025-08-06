// components/userboard/ChatTab.tsx
import * as React from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./ChatMessage";
import { v4 as uuidv4 } from 'uuid';

interface ChatTabProps {
  currentChatMessages: {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: string;
  }[];
  onSendMessage: (message: string) => void;
}

export function ChatTab({ currentChatMessages, onSendMessage }: ChatTabProps) {
  const [inputMessage, setInputMessage] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  React.useEffect(() => {
    // Scroll to the bottom of the chat view when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatMessages]);

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
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} /> {/* Dummy div to scroll to */}
        </div>
      </ScrollArea>
      <div className="border-t p-4 flex items-center gap-2">
        <Textarea
          placeholder="Type your message here..."
          className="flex-1 resize-none"
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button size="icon" onClick={handleSendMessage}>
          <PaperPlaneIcon className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}