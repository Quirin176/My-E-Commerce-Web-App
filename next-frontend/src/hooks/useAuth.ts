import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import Cookies from 'js-cookie';
import { User } from '@/types';

export const useAuth = () => {
  const { user, token, login, logout, setUser } = useAuthStore();

  useEffect(() => {
    // Initialize auth from cookies
    const storedToken = Cookies.get('token');
    const storedUser = Cookies.get('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser) as User;
        setUser(userData);
      } catch (e) {
        logout();
      }
    }
  }, [setUser, logout]);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'Admin';

  return { user, token, isAuthenticated, isAdmin, login, logout };
};
