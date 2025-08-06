import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface ChatMessage {
    id: string;
    content: string;
    is_user_message: boolean; 
    timestamp: string;
    session_id: string;
}

export interface ChatSession {
    id: string | number; 
    title: string;
    created_at: string;
    updated_at?: string; 
    owner_id?: string | number;  
    user_id?: string | number;
    messages: ChatMessage[];
    messagesLoaded?: boolean;
}

interface ChatContextType {
    sessions: ChatSession[];
    currentSession: ChatSession | null;
    isLoading: boolean;
    error: string | null;
    addSession: (title?: string) => Promise<ChatSession>;
    updateSession: (sessionId: string, updates: Partial<ChatSession>) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
    setCurrentSession: (sessionId: string) => void;
    addMessage: (sessionId: string, content: string, isUserMessage: boolean) => Promise<void>;
    updateMessage: (sessionId: string, messageId: string, content: string) => Promise<void>;
    deleteMessage: (sessionId: string, messageId: string) => Promise<void>;
    clearSession: (sessionId: string) => Promise<void>;
    exportSession: (sessionId: string) => string;
    importSession: (sessionData: string) => Promise<void>;
    loadSessions: () => Promise<void>;
    loadMessages: (sessionId: string) => Promise<void>;
    refreshCurrentSession: () => Promise<void>;
    clearAllSessions: () => void;
    reloadSessions: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSession, setCurrentSessionState] = useState<ChatSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const getAuthToken = () => localStorage.getItem('access_token');
    const API_BASE = 'http://localhost:8000';

    // Clear sessions when authentication token is removed
    useEffect(() => {
        const handleStorageChange = () => {
            const token = getAuthToken();
            if (!token) {
                console.log('DEBUG: No auth token found, clearing chat sessions');
                setSessions([]);
                setCurrentSessionState(null);
                setError(null);
            }
        };

        const handleLogout = () => {
            console.log('DEBUG: Logout event received, clearing chat sessions');
            setSessions([]);
            setCurrentSessionState(null);
            setError(null);
        };

        // Check on mount
        handleStorageChange();

        // Listen for storage changes
        window.addEventListener('storage', handleStorageChange);

        // Listen for logout events
        window.addEventListener('userLogout', handleLogout);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userLogout', handleLogout);
        };
    }, []);

    // Load sessions on mount and when token becomes available
    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            loadSessions();
            setIsInitialLoad(false);
        }
    }, [isInitialLoad]);

    // Listen for login events to reload sessions
    useEffect(() => {
        const handleLogin = () => {
            console.log('DEBUG: Login event received, reloading sessions');
            const token = getAuthToken();
            if (token) {
                loadSessions();
            }
        };

        // Listen for login events
        window.addEventListener('userLogin', handleLogin);

        return () => {
            window.removeEventListener('userLogin', handleLogin);
        };
    }, []);


    const loadSessions = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = getAuthToken();
            console.log('DEBUG: Loading sessions, token exists:', !!token);

            if (!token) {
                console.log('DEBUG: No authentication token, setting empty sessions');
                setSessions([]);
                setCurrentSessionState(null);
                return;
            }

            console.log('DEBUG: Making API call to load sessions');
            const response = await fetch(`${API_BASE}/chat_sessions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('DEBUG: Load sessions response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('access_token');
                    setSessions([]);
                    setCurrentSessionState(null);
                    return;
                }
                throw new Error(`Failed to load sessions: ${response.status}`);
            }

            const data = await response.json();
            const sessionsData = Array.isArray(data) ? data : (data.sessions || []);
            console.log('DEBUG: Received sessions data:', sessionsData);

            // Convert to ChatSession format with empty messages array initially
            const sessionsWithEmptyMessages = sessionsData.map((session: any) => ({
                id: session.id,
                title: session.title,
                created_at: session.created_at,
                updated_at: session.updated_at || session.created_at, // Use created_at as fallback
                owner_id: session.owner_id,
                user_id: session.owner_id, 
                messages: [],
                messagesLoaded: false
            }));

            console.log('DEBUG: Setting sessions with empty messages initially');
            setSessions(sessionsWithEmptyMessages);

            if (sessionsWithEmptyMessages.length > 0) {
                setCurrentSessionState(sessionsWithEmptyMessages[0]);
                // Only load messages for the first session, not all sessions
                await loadMessages(sessionsWithEmptyMessages[0].id.toString());
            }
        } catch (err) {
            console.error('DEBUG: Error loading sessions:', err);
            setError(err instanceof Error ? err.message : 'Failed to load sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const loadMessages = async (sessionId: string) => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token');
            }
    
            console.log('DEBUG: Loading messages for session:', sessionId);
            const response = await fetch(`${API_BASE}/chat_sessions/${sessionId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('access_token');
                    throw new Error('Authentication expired');
                }
                throw new Error(`Failed to load messages: ${response.status}`);
            }
    
            const data = await response.json();
            const messages = Array.isArray(data) ? data : (data.messages || []);
            console.log('DEBUG: Loaded messages for session', sessionId, ':', messages.length, 'messages');
    
            // Convert backend message format to frontend format
            const formattedMessages = messages.map((msg: any) => ({
                id: msg.id.toString(),
                content: msg.content,
                is_user_message: msg.is_user_message,
                timestamp: msg.created_at,
                session_id: msg.session_id.toString()
            }));
    
            // Update sessions with messages - FIXED: Use functional update to avoid stale closures
            console.log('DEBUG: Updating sessions with messages for sessionId:', sessionId);
            setSessions(prev => {
                const updated = prev.map(session => {
                    if (session.id.toString() === sessionId.toString()) {
                        return { ...session, messages: formattedMessages, messagesLoaded: true }; // <-- Set flag
                    }
                    return session;
                });
                return updated;
            });
    
            // Update current session if it's the one we're loading - FIXED: Use functional update
            setCurrentSessionState(prev => {
                if (prev?.id.toString() === sessionId.toString()) {
                    console.log('DEBUG: Updating current session with messages');
                    return { ...prev, messages: formattedMessages };
                }
                return prev;
            });
        } catch (err) {
            console.error('DEBUG: Error loading messages:', err);
            setError(err instanceof Error ? err.message : 'Failed to load messages');
            throw err;
        }
    };

    const setCurrentSession = (sessionId: string) => {
        const session = sessions.find(s => s.id.toString() === sessionId.toString());
        if (session) {
            setCurrentSessionState(session);
            // Only load messages if not already loaded
            if (!session.messagesLoaded) {
                loadMessages(sessionId).catch(console.error);
            }
        }
    };

    const addSession = async (title?: string): Promise<ChatSession> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const sessionTitle = title || 'New Chat';
            const response = await fetch(`${API_BASE}/chat_sessions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: sessionTitle })
            });

            if (!response.ok) {
                throw new Error(`Failed to create session: ${response.status}`);
            }

            const data = await response.json();
            const newSession = {
                id: data.id,
                title: data.title,
                created_at: data.created_at,
                updated_at: data.updated_at || data.created_at, 
                owner_id: data.owner_id,
                user_id: data.owner_id, 
                messages: [],
                messagesLoaded: true
            };

            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionState(newSession);

            return newSession;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create session');
            throw err;
        }
    };

    const updateSession = async (sessionId: string, updates: Partial<ChatSession>): Promise<void> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token');
            }
    
            // Only send title in the request body as that's what backend expects
            const requestBody = {
                title: updates.title
            };
    
            const response = await fetch(`${API_BASE}/chat_sessions/${sessionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update session: ${response.status}`);
            }
    
            // Update local state with the changes
            setSessions(prev => prev.map(session => {
                if (session.id.toString() === sessionId.toString()) {
                    return { 
                        ...session, 
                        ...updates,
                        updated_at: new Date().toISOString() // Update timestamp locally
                    };
                }
                return session;
            }));
    
            if (currentSession?.id.toString() === sessionId.toString()) {
                setCurrentSessionState(prev => prev ? { 
                    ...prev, 
                    ...updates,
                    updated_at: new Date().toISOString() // Update timestamp locally
                } : null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update session');
            throw err;
        }
    };

    const deleteSession = async (sessionId: string): Promise<void> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_BASE}/chat_sessions/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete session: ${response.status}`);
            }

            setSessions(prev => prev.filter(session => session.id.toString() !== sessionId.toString()));

            // If we deleted the current session, switch to another one
            if (currentSession?.id.toString() === sessionId.toString()) {
                const remainingSessions = sessions.filter(session => session.id.toString() !== sessionId.toString());
                if (remainingSessions.length > 0) {
                    setCurrentSessionState(remainingSessions[0]);
                } else {
                    setCurrentSessionState(null);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete session');
            throw err;
        }
    };

    const addMessage = async (sessionId: string, content: string, isUserMessage: boolean): Promise<void> => {
        // 1. Create a temporary user message
        const tempUserId = `temp-user-${Date.now()}`;
        const tempUserMessage: ChatMessage = {
            id: tempUserId,
            content,
            is_user_message: isUserMessage,
            timestamp: new Date().toISOString(),
            session_id: sessionId,
        };
    
        // 2. Create a temporary "Thinking..." agent message
        const tempAgentId = `temp-agent-${Date.now()}`;
        const tempAgentMessage: ChatMessage = {
            id: tempAgentId,
            content: "Thinking...",
            is_user_message: false,
            timestamp: new Date().toISOString(),
            session_id: sessionId,
        };
    
        // 3. Optimistically add both messages to the UI
        setSessions(prev =>
            prev.map(session =>
                session.id.toString() === sessionId.toString()
                    ? { ...session, messages: [...session.messages, tempUserMessage, tempAgentMessage] }
                    : session
            )
        );
        if (currentSession?.id.toString() === sessionId.toString()) {
            setCurrentSessionState(prev =>
                prev ? { ...prev, messages: [...prev.messages, tempUserMessage, tempAgentMessage] } : null
            );
        }
    
        try {
            const token = getAuthToken();
            if (!token) throw new Error('No authentication token');
    
            const response = await fetch(`${API_BASE}/chat_sessions/${sessionId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: content,
                    is_user_message: isUserMessage ? true : false
                })
            });
    
            if (!response.ok) throw new Error(`Failed to add message: ${response.status}`);
    
            const data = await response.json();
    
            // 4. Prepare the real user and agent messages from backend
            const messagesToAdd: ChatMessage[] = [];
            if (data.user_message) {
                messagesToAdd.push({
                    id: data.user_message.id.toString(),
                    content: data.user_message.content,
                    is_user_message: data.user_message.is_user_message,
                    timestamp: data.user_message.created_at,
                    session_id: data.user_message.session_id.toString()
                });
            }
            if (data.agent_message) {
                messagesToAdd.push({
                    id: data.agent_message.id.toString(),
                    content: data.agent_message.content,
                    is_user_message: data.agent_message.is_user_message,
                    timestamp: data.agent_message.created_at,
                    session_id: data.agent_message.session_id.toString()
                });
            }
    
            // 5. Replace the temp user and agent messages with the real ones
            setSessions(prev =>
                prev.map(session =>
                    session.id.toString() === sessionId.toString()
                        ? {
                            ...session,
                            messages: [
                                ...session.messages.filter(
                                    msg => msg.id !== tempUserId && msg.id !== tempAgentId
                                ),
                                ...messagesToAdd
                            ],
                            updated_at: new Date().toISOString()
                        }
                        : session
                )
            );
            if (currentSession?.id.toString() === sessionId.toString()) {
                setCurrentSessionState(prev =>
                    prev
                        ? {
                            ...prev,
                            messages: [
                                ...prev.messages.filter(
                                    msg => msg.id !== tempUserId && msg.id !== tempAgentId
                                ),
                                ...messagesToAdd
                            ],
                            updated_at: new Date().toISOString()
                        }
                        : null
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add message');
            // Optionally: remove the temp messages if the request failed
            setSessions(prev =>
                prev.map(session =>
                    session.id.toString() === sessionId.toString()
                        ? {
                            ...session,
                            messages: session.messages.filter(
                                msg => msg.id !== tempUserId && msg.id !== tempAgentId
                            )
                        }
                        : session
                )
            );
            if (currentSession?.id.toString() === sessionId.toString()) {
                setCurrentSessionState(prev =>
                    prev
                        ? {
                            ...prev,
                            messages: prev.messages.filter(
                                msg => msg.id !== tempUserId && msg.id !== tempAgentId
                            )
                        }
                        : null
                );
            }
            throw err;
        }
    };

    const updateMessage = async (sessionId: string, messageId: string, content: string): Promise<void> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_BASE}/chat_sessions/${sessionId}/messages/${messageId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: content })
            });

            if (!response.ok) {
                throw new Error(`Failed to update message: ${response.status}`);
            }

            setSessions(prev => prev.map(session => {
                if (session.id.toString() === sessionId.toString()) {
                    return {
                        ...session,
                        messages: session.messages.map(msg =>
                            msg.id.toString() === messageId.toString() ? { ...msg, text: content } : msg
                        )
                    };
                }
                return session;
            }));

            if (currentSession?.id.toString() === sessionId.toString()) {
                setCurrentSessionState(prev => prev ? {
                    ...prev,
                    messages: prev.messages.map(msg =>
                        msg.id.toString() === messageId.toString() ? { ...msg, text: content } : msg
                    )
                } : null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update message');
            throw err;
        }
    };

    const deleteMessage = async (sessionId: string, messageId: string): Promise<void> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_BASE}/chat_sessions/${sessionId}/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete message: ${response.status}`);
            }

            setSessions(prev => prev.map(session => {
                if (session.id.toString() === sessionId.toString()) {
                    return {
                        ...session,
                        messages: session.messages.filter(msg => msg.id.toString() !== messageId.toString())
                    };
                }
                return session;
            }));

            if (currentSession?.id.toString() === sessionId.toString()) {
                setCurrentSessionState(prev => prev ? {
                    ...prev,
                    messages: prev.messages.filter(msg => msg.id.toString() !== messageId.toString())
                } : null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete message');
            throw err;
        }
    };

    const clearSession = async (sessionId: string): Promise<void> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_BASE}/chat_sessions/${sessionId}/messages`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to clear session: ${response.status}`);
            }

            setSessions(prev => prev.map(session => {
                if (session.id.toString() === sessionId.toString()) {
                    return { ...session, messages: [] };
                }
                return session;
            }));

            if (currentSession?.id.toString() === sessionId.toString()) {
                setCurrentSessionState(prev => prev ? { ...prev, messages: [] } : null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to clear session');
            throw err;
        }
    };

    const exportSession = (sessionId: string): string => {
        const session = sessions.find(s => s.id === sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        return JSON.stringify(session, null, 2);
    };

    const importSession = async (sessionData: string): Promise<void> => {
        try {
            const session = JSON.parse(sessionData);
            // Validate session structure
            if (!session.title || !session.messages) {
                throw new Error('Invalid session data format');
            }

            // Create new session with imported data
            const newSession = await addSession(session.title);

            // Add all messages from imported session
            for (const message of session.messages) {
                await addMessage(newSession.id.toString(), message.text, message.sender === 'user');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import session');
            throw err;
        }
    };

    const clearAllSessions = () => {
        console.log('DEBUG: Clearing all chat sessions');
        setSessions([]);
        setCurrentSessionState(null);
        setError(null);
    };

    const reloadSessions = async () => {
        console.log('DEBUG: Manually reloading sessions');
        const token = getAuthToken();
        if (token) {
            await loadSessions();
        }
    };

    const refreshCurrentSession = async () => {
        if (currentSession && currentSession.id) {
            await loadMessages(currentSession.id.toString());
        }
    };

    const value: ChatContextType = {
        sessions,
        currentSession,
        isLoading,
        error,
        refreshCurrentSession,
        addSession,
        updateSession,
        deleteSession,
        setCurrentSession,
        addMessage,
        updateMessage,
        deleteMessage,
        clearSession,
        exportSession,
        importSession,
        loadSessions,
        loadMessages,
        clearAllSessions,
        reloadSessions
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};