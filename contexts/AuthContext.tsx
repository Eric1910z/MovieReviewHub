import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { loginUser } from '../services/apiService';

interface User {
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
      }
  }, []);

  const login = async (username: string, password: string) => {
    try {
        const userData = await loginUser({ username, password });
        setIsAuthenticated(true);
        setUser({ name: userData.username });
        localStorage.setItem('user', JSON.stringify({ name: userData.username }));
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = { isAuthenticated, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};