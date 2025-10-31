import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import GoogleAuthService from './googleAuthService';
import RegistrationService from './registrationService';

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
      // First check locally registered users
      const localUser = await RegistrationService.getUserByEmail(email);
      if (localUser) {
        // Check password for local user
        if (localUser.password !== password) {
          return {
            success: false,
            error: 'Invalid password. Please try again.'
          };
        }

        // Generate and store auth token
        const token = await this.generateAuthToken(localUser);
        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('currentUser', JSON.stringify(localUser));

        console.log(`Local user ${localUser.personalInfo.firstName} ${localUser.personalInfo.lastName} authenticated successfully`);
        
        return {
          success: true,
          user: localUser as User
        };
      }

      // Load remote users if not already loaded
      if (this.users.length === 0) {
        await this.loadUsers();
      }

      // Find user by email in remote database
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

  // OAuth2 authentication for Google (Personal)
  public async authenticateWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('Starting Google OAuth2 authentication...');
      
      // Use the Google OAuth2 service
      const googleResult = await GoogleAuthService.authenticateWithGoogle();
      
      if (!googleResult.success || !googleResult.user) {
        return {
          success: false,
          error: googleResult.error || 'Google authentication failed'
        };
      }

      // Try to find existing user in database by email
      if (this.users.length === 0) {
        await this.loadUsers();
      }

      let user = this.users.find(u => u.email.toLowerCase() === googleResult.user!.email.toLowerCase());
      
      if (!user) {
        // Create a new user from Google account
        user = this.createUserFromGoogleAccount(googleResult.user);
        console.log(`Created new user from Google account: ${user.personalInfo.firstName} ${user.personalInfo.lastName}`);
      }

      // Generate and store auth token
      const token = await this.generateAuthToken(user);
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('currentUser', JSON.stringify(user));
      
      console.log(`Google OAuth2 authenticated: ${user.personalInfo.firstName} ${user.personalInfo.lastName}`);
      
      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Google OAuth2 error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google authentication failed. Please try again.'
      };
    }
  }

  // Create a user profile from Google account
  private createUserFromGoogleAccount(googleUser: any): User {
    return {
      id: `google_${googleUser.id}`,
      email: googleUser.email,
      password: '', // No password for OAuth users
      personalInfo: {
        firstName: googleUser.given_name || googleUser.name.split(' ')[0] || 'Unknown',
        lastName: googleUser.family_name || googleUser.name.split(' ').slice(1).join(' ') || 'User',
        phone: '',
        dateOfBirth: ''
      },
      academicInfo: {
        university: 'Not specified',
        department: 'Not specified',
        degreeLevel: 'Not specified',
        yearOfStudy: 1,
        expectedGraduation: '',
        advisor: '',
        researchAreas: [],
        currentGPA: 0,
        publications: 0,
        conferences: 0
      },
      accountSettings: {
        isVerified: googleUser.verified_email || false,
        profileVisibility: 'public',
        collaborationStatus: 'available'
      }
    };
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