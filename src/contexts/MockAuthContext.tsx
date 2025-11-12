import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Mock AuthProvider para desenvolvimento sem Firebase
export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user para desenvolvimento
    setUser({
      id: 'mock-user-id',
      email: email,
      name: 'Usuário Teste',
      createdAt: new Date().toISOString()
    });
    setLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: 'mock-user-id',
      email: email,
      name: name,
      createdAt: new Date().toISOString()
    });
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    console.log('Mock: Reset password para', email);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};