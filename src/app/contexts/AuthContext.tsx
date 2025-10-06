"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, loginRequest, loginResponse, registerRequest, registerResponse } from '@/app/types/auth';
import { authService } from '@/app/services/authServices';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: loginRequest) => Promise<void>;
  register: (userData: registerRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'dailyiu_token';
const USER_KEY = 'dailyiu_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
      clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuth = (token: string, userData: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const clearStoredAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const login = async (credentials: loginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response: loginResponse = await authService.login(credentials);
      storeAuth(response.token, response.user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: registerRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response: registerResponse = await authService.register(userData);
      
      if (response.status === 'success') {
        await login({
          email: userData.email,
          password: userData.password,
        });
      } else {
        throw new Error(response.message || 'Erro no registro');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearStoredAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};