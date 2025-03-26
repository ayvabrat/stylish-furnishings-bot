
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check for existing admin session on mount
  useEffect(() => {
    const adminAuth = loadFromLocalStorage('admin_auth', false);
    if (adminAuth === true) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    // Simple password check - in production, this should be more secure
    if (password === 'mebel2024') {
      setIsAuthenticated(true);
      saveToLocalStorage('admin_auth', true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    saveToLocalStorage('admin_auth', false);
    navigate('/admin/login');
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
