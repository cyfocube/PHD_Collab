import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

// GitHub database URL
const USERS_DATABASE_URL = 'https://raw.githubusercontent.com/cyfocube/C_DataBase/main/database/PhD_Collab_Users/users.json';

interface User {
  id: string;
  email: string;
  password: string;
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

interface UsersDatabase {
  users: User[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalUsers: number;
    schemaVersion: string;
  };
}

export class AuthService {
  private static instance: AuthService;
  private users: User[] = [];

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Load users from GitHub database
  private async loadUsers(): Promise<void> {
    try {
      console.log('Loading users from GitHub database...');
      const response = await fetch(USERS_DATABASE_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      const data: UsersDatabase = await response.json();
      this.users = data.users;
      console.log(`Loaded ${this.users.length} users from database`);
    } catch (error) {
      console.error('Error loading users from database:', error);
      throw new Error('Failed to load user database. Please check your internet connection.');
    }
  }

  // Authenticate user with email and password
  public async authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Load users if not already loaded
      if (this.users.length === 0) {
        await this.loadUsers();
      }

      // Find user by email
      const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        return {
          success: false,
          error: 'User not found. Please check your email address.'
        };
      }

      // Check password
      if (user.password !== password) {
        return {
          success: false,
          error: 'Invalid password. Please try again.'
        };
      }

      // Check if user is verified
      if (!user.accountSettings.isVerified) {
        return {
          success: false,
          error: 'Your account is not verified. Please contact your administrator.'
        };
      }

      // Generate and store auth token
      const token = await this.generateAuthToken(user);
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('currentUser', JSON.stringify(user));

      console.log(`User ${user.personalInfo.firstName} ${user.personalInfo.lastName} authenticated successfully`);
      
      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed. Please try again.'
      };
    }
  }

  // Generate secure auth token
  private async generateAuthToken(user: User): Promise<string> {
    const payload = {
      userId: user.id,
      email: user.email,
      timestamp: Date.now(),
      random: Math.random().toString(36)
    };
    const token = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      JSON.stringify(payload),
      { encoding: Crypto.CryptoEncoding.HEX }
    );
    return token;
  }

  // OAuth2 authentication for Google (University)
  public async authenticateWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // For demo purposes, simulate OAuth2 flow
      // In production, you would implement proper OAuth2 with university SSO
      console.log('Initiating Google OAuth2 for university accounts...');
      
      // Simulate OAuth2 delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, automatically authenticate with the first university user
      const demoUser = this.users.find(u => u.email === 'demo@university.edu');
      if (demoUser) {
        const token = await this.generateAuthToken(demoUser);
        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('currentUser', JSON.stringify(demoUser));
        
        console.log(`OAuth2 authenticated: ${demoUser.personalInfo.firstName} ${demoUser.personalInfo.lastName}`);
        
        return {
          success: true,
          user: demoUser
        };
      }

      return {
        success: false,
        error: 'OAuth2 authentication failed or was cancelled.'
      };
    } catch (error) {
      console.error('Google OAuth2 error:', error);
      return {
        success: false,
        error: 'Google authentication failed. Please try again.'
      };
    }
  }

  // OAuth2 authentication for GitHub
  public async authenticateWithGitHub(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // For demo purposes, simulate GitHub OAuth2 flow
      console.log('Initiating GitHub OAuth2 authentication...');
      
      // Simulate OAuth2 delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, authenticate with Alex Chen (MIT user)
      const demoUser = this.users.find(u => u.email === 'alex.chen@mit.edu');
      if (demoUser) {
        const token = await this.generateAuthToken(demoUser);
        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('currentUser', JSON.stringify(demoUser));
        
        console.log(`GitHub OAuth2 authenticated: ${demoUser.personalInfo.firstName} ${demoUser.personalInfo.lastName}`);
        
        return {
          success: true,
          user: demoUser
        };
      }

      return {
        success: false,
        error: 'GitHub authentication failed or was cancelled.'
      };
    } catch (error) {
      console.error('GitHub OAuth2 error:', error);
      return {
        success: false,
        error: 'GitHub authentication failed. Please try again.'
      };
    }
  }

  // Check if user is authenticated
  public async isAuthenticated(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  // Get current user
  public async getCurrentUser(): Promise<User | null> {
    try {
      const userString = await SecureStore.getItemAsync('currentUser');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Logout user
  public async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('currentUser');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Get all available users (for demo purposes)
  public async getAllUsers(): Promise<User[]> {
    if (this.users.length === 0) {
      await this.loadUsers();
    }
    return this.users;
  }
}

export default AuthService.getInstance();