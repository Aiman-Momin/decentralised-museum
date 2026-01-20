import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

export type UserRole = 'artist' | 'visitor' | 'dao-member';
export type AuthMethod = 'metamask' | 'google' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    address?: string;
    email?: string;
    role: UserRole | null;
    authMethod: AuthMethod;
    name?: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  loginWithMetaMask: (role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  signupWithMetaMask: (role: UserRole) => Promise<void>;
  signupWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const loginWithMetaMask = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      // Get user info from server or create if new
      const response = await fetch(`/api/users/me/${address}`);
      const userData = await response.json();

      const userObj = {
        address,
        role,
        authMethod: 'metamask' as const,
        name: userData.name || `User ${address.slice(0, 6)}`,
      };

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (err: any) {
      setError(err.message || 'Failed to login with MetaMask');
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithMetaMask = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      // Create user on server
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          role,
          isDaoMember: role === 'dao-member',
        }),
      });

      if (!response.ok) throw new Error('Failed to create account');

      const userData = await response.json();

      const userObj = {
        address,
        role,
        authMethod: 'metamask' as const,
        name: `User ${address.slice(0, 6)}`,
      };

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (err: any) {
      setError(err.message || 'Failed to signup with MetaMask');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement Google OAuth flow
      // This would typically involve:
      // 1. Redirecting to Google OAuth endpoint
      // 2. Handling callback
      // 3. Creating/updating user record
      
      throw new Error('Google login is coming soon!');
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithGoogle = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement Google OAuth signup flow
      throw new Error('Google signup is coming soon!');
    } catch (err: any) {
      setError(err.message || 'Failed to signup with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        loginWithMetaMask,
        loginWithGoogle,
        signupWithMetaMask,
        signupWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
