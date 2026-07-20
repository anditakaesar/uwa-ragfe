import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContextSetup';
import { axiosClient } from '../api/axiosClient';
import { useQueryClient } from '@tanstack/react-query';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  };

  const queryClient = useQueryClient()
  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout')
    } catch (err) {
      console.error("Logout failed", err)
    } finally {
      localStorage.removeItem('token')
      setToken(null)
      queryClient.clear()
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axiosClient.post('/auth/refresh');
        const {token} = response.data.data
        localStorage.setItem("token", token)
        setToken(token);
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
