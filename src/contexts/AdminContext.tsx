
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AdminContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing admin session on mount and set up auth listener
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user has admin role
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin');

          if (roles && roles.length > 0) {
            setIsAuthenticated(true);
            setUser(session.user);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Check admin role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin');

        if (roles && roles.length > 0) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Ошибка входа: ' + error.message);
        return false;
      }

      if (data.user) {
        // Check if user has admin role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin');

        if (!roles || roles.length === 0) {
          await supabase.auth.signOut();
          toast.error('У вас нет прав администратора');
          return false;
        }

        setIsAuthenticated(true);
        setUser(data.user);
        toast.success('Вход выполнен успешно');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ошибка при входе');
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
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
