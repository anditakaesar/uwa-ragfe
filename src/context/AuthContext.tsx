// src/context/AuthContext.tsx
import { useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContextSetup';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://localhost:3000/api';

// 3. Export your main component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (newToken: string) => setToken(newToken);

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setToken(null);
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.post('/auth/refresh');
        setToken(response.data.data.token);
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
