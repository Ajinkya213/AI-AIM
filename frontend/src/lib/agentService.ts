// src/lib/agentService.ts

const API_BASE = 'http://localhost:8000';

export interface AgentQueryRequest {
    query: string;
    agent_type?: string;
    context?: any;
}

export interface AgentQueryResponse {
    success: boolean;
    response?: string;
    error?: string;
    agent_type?: string;
    query?: string;
    agent_selection?: {
        selected_agent: string;
        confidence: number;
        reasoning: any;
        all_scores: any;
        top_agents: any[];
        query: string;
    };
}

export class AgentService {
    private static getAuthToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private static async refreshTokenIfNeeded(): Promise<boolean> {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                return false;
            }

            const response = await fetch(`${API_BASE}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access_token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    static async queryAgent(request: AgentQueryRequest): Promise<AgentQueryResponse> {
        try {
            let token = this.getAuthToken();

            // If no token, try to refresh
            if (!token) {
                const refreshed = await this.refreshTokenIfNeeded();
                if (refreshed) {
                    token = this.getAuthToken();
                }
            }

            if (!token) {
                // Dispatch logout event to clear all contexts
                window.dispatchEvent(new CustomEvent('userLogout'));
                throw new Error('No authentication token available');
            }

            const response = await fetch(`${API_BASE}/agent/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(request)
            });

            if (response.status === 401) {
                // Token expired, try to refresh
                const refreshed = await this.refreshTokenIfNeeded();
                if (refreshed) {
                    // Retry the request with new token
                    const newToken = this.getAuthToken();
                    const retryResponse = await fetch(`${API_BASE}/agent/query`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify(request)
                    });

                    if (retryResponse.ok) {
                        return await retryResponse.json();
                    }
                }

                // If refresh failed, clear tokens and throw error
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.dispatchEvent(new CustomEvent('userLogout'));
                throw new Error('Authentication expired');
            }

            if (!response.ok) {
                throw new Error(`Agent query failed: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Agent query error:', error);
            throw error;
        }
    }

    static async autoQueryAgent(request: { query: string }): Promise<AgentQueryResponse> {
        try {
            let token = this.getAuthToken();

            // If no token, try to refresh
            if (!token) {
                const refreshed = await this.refreshTokenIfNeeded();
                if (refreshed) {
                    token = this.getAuthToken();
                }
            }

            if (!token) {
                // Dispatch logout event to clear all contexts
                window.dispatchEvent(new CustomEvent('userLogout'));
                throw new Error('No authentication token available');
            }

            const response = await fetch(`${API_BASE}/agent/auto-query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(request)
            });

            if (response.status === 401) {
                // Token expired, try to refresh
                const refreshed = await this.refreshTokenIfNeeded();
                if (refreshed) {
                    // Retry the request with new token
                    const newToken = this.getAuthToken();
                    const retryResponse = await fetch(`${API_BASE}/agent/auto-query`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify(request)
                    });

                    if (retryResponse.ok) {
                        return await retryResponse.json();
                    }
                }

                // If refresh failed, clear tokens and throw error
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.dispatchEvent(new CustomEvent('userLogout'));
                throw new Error('Authentication expired');
            }

            if (!response.ok) {
                throw new Error(`Auto agent query failed: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Auto agent query error:', error);
            throw error;
        }
    }

    static async testAgent(query: string): Promise<AgentQueryResponse> {
        try {
            const response = await fetch(`${API_BASE}/agent/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                throw new Error(`Agent test failed: ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Agent test error:', error);
            throw error;
        }
    }

    static async getAgentHealth(): Promise<any> {
        try {
            const response = await fetch(`${API_BASE}/agent/health`);

            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Agent health check error:', error);
            throw error;
        }
    }

    static async getAgentStatus(agentType?: string): Promise<any> {
        try {
            const url = agentType
                ? `${API_BASE}/agent/status?agent_type=${agentType}`
                : `${API_BASE}/agent/status`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Status check failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Agent status check error:', error);
            throw error;
        }
    }

    static async getAgentStats(agentType?: string): Promise<any> {
        try {
            const url = agentType
                ? `${API_BASE}/agent/stats?agent_type=${agentType}`
                : `${API_BASE}/agent/stats`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Stats check failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Agent stats check error:', error);
            throw error;
        }
    }

    static async uploadDocument(file: File): Promise<any> {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE}/agent/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Document upload failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Document upload error:', error);
            throw error;
        }
    }
} 