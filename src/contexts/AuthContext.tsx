import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  userIdentifier: string;
  emailAddress: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo credentials
const DEMO_CREDENTIALS = {
  email: 'admin@ubuntu.com',
  password: 'admin123',
  user: {
    userIdentifier: '1',
    emailAddress: 'admin@ubuntu.com',
    fullName: 'Ubuntu Administrator',
    role: 'Administrator',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for existing tokens on mount
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userData = localStorage.getItem('userData');

    if (accessToken && refreshToken && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  // If already authenticated and user lands on "/", "/login", or "/register", redirect to "/portal"
  useEffect(() => {
    if (isLoading) return;
    const publicPaths = ['/', '/login', '/register'];
    if (user && publicPaths.includes(location.pathname)) {
      navigate('/portal', { replace: true });
    }
  }, [isLoading, user, location.pathname, navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo authentication
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        // Simulate JWT tokens (in real app, these would come from backend)
        const accessToken = 'demo_access_token_' + Date.now();
        const refreshToken = 'demo_refresh_token_' + Date.now();

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(DEMO_CREDENTIALS.user));

        setUser(DEMO_CREDENTIALS.user);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo registration (in real app, this would call backend API)
      const newUser: User = {
        userIdentifier: Date.now().toString(),
        emailAddress: email,
        fullName,
        role: 'User',
      };

      const accessToken = 'demo_access_token_' + Date.now();
      const refreshToken = 'demo_refresh_token_' + Date.now();

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userData', JSON.stringify(newUser));

      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
    navigate('/');
  };

  // Function to refresh access token (would be called when API returns 401)
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      // In real app, call refresh endpoint
      // const response = await fetch('/api/auth/refresh', { ... });

      // Demo refresh
      const newAccessToken = 'demo_access_token_refreshed_' + Date.now();
      const newRefreshToken = 'demo_refresh_token_refreshed_' + Date.now();

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};