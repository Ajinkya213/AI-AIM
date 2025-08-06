// pages/Userboard.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { Sidebar } from '../../components/userboard/Sidebar';
import { MainContent } from '../../components/userboard/MainContent';

export default function Userboard() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { currentSession, sessions, addSession, setCurrentSession } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Handle session selection from URL
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session');

    if (sessionId && sessions.length > 0) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSession(sessionId);
      }
    }
  }, [location.search, sessions, setCurrentSession]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };



  const handleNewQuery = async () => {
    try {
      const newSession = await addSession();
      navigate(`/userboard?session=${newSession.id}`);
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSession(sessionId);
    navigate(`/userboard?session=${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        sessions={sessions}
        currentSession={currentSession}
        onNewQuery={handleNewQuery}
        onSessionSelect={handleSessionSelect}
        onLogout={handleLogout}
        user={user}
      />
      <MainContent />
    </div>
  );
}