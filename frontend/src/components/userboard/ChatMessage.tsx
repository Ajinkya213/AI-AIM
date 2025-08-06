// components/userboard/ChatMessage.tsx
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    is_user_message:boolean;
    timestamp: string; // e.g., "10:30 AM"
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.is_user_message;

  return (
    <div className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-ai-avatar.png" alt="AI Avatar" /> {/* Replace with actual AI avatar */}
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        <p>{message.content}</p>
        <span className={cn("block text-xs mt-1", isUser ? "text-primary-foreground/80" : "text-muted-foreground/70")}>
          {message.timestamp}
        </span>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-user-avatar.png" alt="User Avatar" /> {/* Replace with actual user avatar */}
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}