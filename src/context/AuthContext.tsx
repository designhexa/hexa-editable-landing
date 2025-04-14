
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define user roles
export type UserRole = 'editor' | 'admin' | 'viewer';

// Define user structure
export type User = {
  username: string;
  role: UserRole;
};

// Define mock users - In a real app, this would come from a database
const MOCK_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' as UserRole },
  { username: 'editor', password: 'editor123', role: 'editor' as UserRole },
];

// Define context type
export type AuthContextType = {
  currentUser: User | null;
  user: User | null; // Add user property (will be the same as currentUser for compatibility)
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    const user = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      toast({
        title: "Login successful",
        description: `Welcome, ${username}!`,
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password.",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logout successful",
      description: "You have been logged out.",
    });
    navigate('/login');
  };

  // Check if user has required role
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!currentUser) return false;
    
    if (currentUser.role === 'admin') return true;
    
    if (requiredRole === 'editor' && currentUser.role === 'editor') return true;
    
    return false;
  };

  const value = {
    currentUser,
    user: currentUser, // Set user as the same as currentUser for backward compatibility
    isAuthenticated: !!currentUser,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
