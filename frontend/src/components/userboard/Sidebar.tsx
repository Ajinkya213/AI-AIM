// components/userboard/Sidebar.tsx
import * as React from "react";
import { useLocation } from "react-router-dom";
import { ChevronRightIcon, PlusIcon, GearIcon, ExitIcon, TrashIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { useChat, type ChatSession } from "../../contexts/ChatContext";
import { ThemeToggle } from "../ThemeToggle";
import { date } from "zod";
import { Input } from "../ui/input";

interface User {
  id: string;
  username: string;
  email: string;
  password: string;  
  is_active: boolean;
  is_superuser: boolean; 
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onNewQuery: () => void;
  onSessionSelect: (sessionId: string) => void;
  onLogout: () => void;
  user: User | null;
}

export function Sidebar({ sessions, currentSession, onNewQuery, onSessionSelect, onLogout, user }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const { deleteSession, updateSession } = useChat();
  const location = useLocation();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Determine current session ID from URL
  const currentSessionId = new URLSearchParams(location.search).get("query");

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat session?")) {
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error('Failed to delete session:', error);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  const handleRenameSession = (session: ChatSession) => {
    setEditingSessionId(session.id.toString());
    setEditTitle(session.title);
    // Focus the input after a brief delay to ensure it's rendered
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleSaveRename = async () => {
    if (!editingSessionId || !editTitle.trim()) {
      setEditingSessionId(null);
      return;
    }

    try {
      await updateSession(editingSessionId, { title: editTitle.trim() });
      setEditingSessionId(null);
      setEditTitle("");
    } catch (error) {
      console.error('Failed to rename session:', error);
      alert('Failed to rename session. Please try again.');
    }
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
    setEditTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="h-screen border-r bg-background flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: isOpen ? "280px" : "60px" }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && <h1 className="text-lg font-semibold">Chat Sessions</h1>}
        <div className="flex items-center gap-2">
          {isOpen && <ThemeToggle size="sm" />}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRightIcon className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 space-y-4">
        <Button
          className="w-full justify-start gap-2"
          variant="default"
          onClick={onNewQuery}
        >
          <PlusIcon className="h-4 w-4" />
          {isOpen && "New Chat"}
        </Button>

        <div className="space-y-2">
          {isOpen && <h2 className="text-sm font-medium text-muted-foreground">Recent Chats</h2>}

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                    currentSession?.id === session.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onSessionSelect(session.id.toString())}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      {editingSessionId === session.id.toString() ? (
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            ref={inputRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-6 text-sm px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveRename();
                            }}
                          >
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelRename();
                            }}
                          >
                            <Cross2Icon className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="truncate">{session.title}</span>
                      )}
                      {isOpen && editingSessionId !== session.id.toString() && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GearIcon className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRenameSession(session)}>
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleDeleteSession(session.id.toString(), e)}
                              className="text-red-600"
                            >
                              <TrashIcon className="h-3 w-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    {isOpen && (
                      <div className="text-xs text-muted-foreground">
                        {formatDate(session.updated_at || Date.now().toString())}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* User section at bottom */}
      {isOpen && user && (
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <GearIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onLogout}>
                  <ExitIcon className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </Collapsible>
  );
}