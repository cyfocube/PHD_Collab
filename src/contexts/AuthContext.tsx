import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../services/authService';

interface User {
  id: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
  };
  academicInfo: {
    university: string;
    department: string;
    degreeLevel: string;
    yearOfStudy: number;
    expectedGraduation: string;
    advisor: string;
    researchAreas: string[];
    currentGPA: number;
    publications: number;
    conferences: number;
  };
  accountSettings: {
    isVerified: boolean;
    profileVisibility: string;
    collaborationStatus: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await AuthService.isAuthenticated();
      const user = await AuthService.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setCurrentUser(user);
      
      if (authenticated && user) {
        console.log(`User session restored: ${user.personalInfo.firstName} ${user.personalInfo.lastName}`);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      console.log('User logged out from context');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};