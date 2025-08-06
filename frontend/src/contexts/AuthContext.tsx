import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE = 'http://127.0.0.1:8000';

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Handle automatic logout when application is closed
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Clear authentication data when user closes the application
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            setIsAuthenticated(false);
            setError(null);

            // Dispatch logout event for other contexts
            window.dispatchEvent(new CustomEvent('userLogout'));
        };

        const handleVisibilityChange = () => {
            // Also logout when user switches tabs or minimizes browser
            if (document.visibilityState === 'hidden') {
                handleBeforeUnload();
            }
        };

        // Add event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup event listeners
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Always clear authentication on app start to redirect to landing page
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setIsAuthenticated(false);
            setUser(null);

            // Dispatch logout event to clear other contexts
            window.dispatchEvent(new CustomEvent('userLogout'));

        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.msg || 'Login failed');
            }

            const accessToken = data.access_token;
            localStorage.setItem('access_token', accessToken);
            const user: User = {
                id: 'temp-id', // You might need to decode this from the token
                username: username,
                email: '', // You might need to fetch this separately
                password: '',
                is_active: true,
                is_superuser: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
    
            setUser(user);
            // Set user and authentication status
            setIsAuthenticated(true);
            setError(null);

            // Dispatch login event for other contexts to listen to
            window.dispatchEvent(new CustomEvent('userLogin'));

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            console.log(response);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            await login(username, password);

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Registration failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                // Call logout endpoint
                await fetch(`${API_BASE}/logout`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage and state regardless of API call success
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            setIsAuthenticated(false);
            setError(null);

            // Dispatch logout event for other contexts to listen to
            window.dispatchEvent(new CustomEvent('userLogout'));
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 