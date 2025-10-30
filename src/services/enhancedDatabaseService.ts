import usersData from '../../database/PhD_Collab_Users/users.json';
import { oauth2Service, OAuth2User } from './oauth2Service';
import * as Crypto from 'expo-crypto';

export interface User {
  id: string;
  email: string;
  password?: string; // Optional for OAuth2 users
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
  profileInfo: {
    bio: string;
    skills: string[];
    languages: string[];
    interests: string[];
    availability: string;
    collaborationPreferences: string[];
  };
  contactInfo: {
    linkedIn?: string;
    github?: string;
    orcid?: string;
    googleScholar?: string;
    researchGate?: string;
  };
  // Enhanced OAuth2 support
  oauthProviders?: {
    [providerId: string]: {
      id: string;
      email?: string;
      verified: boolean;
      connectedAt: string;
      lastUsed?: string;
      profileData?: any;
    };
  };
  accountSettings: {
    isVerified: boolean;
    profileVisibility: string;
    collaborationStatus: string;
    // Enhanced authentication settings
    authMethods: {
      password: boolean;
      oauth2: string[]; // List of connected OAuth2 providers
    };
    notificationPreferences: {
      email: boolean;
      push: boolean;
      matchNotifications: boolean;
      messageNotifications: boolean;
      eventNotifications: boolean;
    };
  };
  metadata: {
    createdAt: string;
    lastActive: string;
    profileImageId: string;
    location: string;
    timezone: string;
    // Enhanced metadata
    registrationMethod: 'password' | 'oauth2';
    lastLoginMethod?: 'password' | 'oauth2';
    lastOAuth2Provider?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
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
  };
  profileInfo: {
    bio: string;
    skills: string[];
    languages: string[];
    interests: string[];
  };
}

export interface OAuth2RegisterData {
  oauth2User: OAuth2User;
  academicInfo: {
    university: string;
    department: string;
    degreeLevel: string;
    yearOfStudy: number;
    expectedGraduation: string;
    advisor: string;
    researchAreas: string[];
  };
  profileInfo: {
    bio: string;
    skills: string[];
    languages: string[];
    interests: string[];
  };
  personalInfo?: {
    phone?: string;
    dateOfBirth?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  message?: string;
  authMethod?: 'password' | 'oauth2';
  provider?: string;
}

class EnhancedDatabaseService {
  private users: User[] = usersData.users as User[];

  // Hash password using expo-crypto
  private async hashPassword(password: string): Promise<string> {
    const salt = Math.random().toString(36).substring(2, 15);
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      salt + password,
      { encoding: Crypto.CryptoEncoding.HEX }
    );
    return `${salt}:${hashedPassword}`;
  }

  // Verify password
  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, hash] = hashedPassword.split(':');
    if (!salt || !hash) return false;
    
    const computedHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      salt + password,
      { encoding: Crypto.CryptoEncoding.HEX }
    );
    
    return computedHash === hash;
  }

  // OAuth2 Authentication
  async loginWithOAuth2(providerId: string): Promise<AuthResponse> {
    try {
      const result = await oauth2Service.authenticateWithProvider(providerId);
      
      if (!result.success || !result.user) {
        return {
          success: false,
          message: result.error || 'OAuth2 authentication failed'
        };
      }

      const oauth2User = result.user;
      
      // Find existing user by email or OAuth2 provider ID
      let user = this.users.find(u => 
        u.email.toLowerCase() === oauth2User.email.toLowerCase() ||
        u.oauthProviders?.[providerId]?.id === oauth2User.providerId
      );

      if (user) {
        // Update existing user with OAuth2 data
        user = await this.updateUserWithOAuth2Data(user, oauth2User);
        user.metadata.lastActive = new Date().toISOString();
        user.metadata.lastLoginMethod = 'oauth2';
        user.metadata.lastOAuth2Provider = providerId;
      } else {
        // New user - need to complete profile
        return {
          success: false,
          message: 'OAuth2 authentication successful, but user profile needs to be created',
          user: {
            id: '',
            email: oauth2User.email,
            personalInfo: {
              firstName: oauth2User.firstName || '',
              lastName: oauth2User.lastName || '',
              phone: '',
              dateOfBirth: ''
            },
            academicInfo: {
              university: oauth2Service.getUniversityFromEmail(oauth2User.email),
              department: '',
              degreeLevel: '',
              yearOfStudy: 0,
              expectedGraduation: '',
              advisor: '',
              researchAreas: [],
              currentGPA: 0,
              publications: 0,
              conferences: 0
            },
            profileInfo: {
              bio: '',
              skills: [],
              languages: [],
              interests: [],
              availability: 'Available for collaboration',
              collaborationPreferences: []
            },
            contactInfo: {
              github: providerId === 'github' ? `https://github.com/${oauth2User.raw.login}` : undefined
            },
            oauthProviders: {
              [providerId]: {
                id: oauth2User.providerId,
                email: oauth2User.email,
                verified: true,
                connectedAt: new Date().toISOString(),
                profileData: oauth2User.raw
              }
            },
            accountSettings: {
              isVerified: oauth2Service.isUniversityEmail(oauth2User.email),
              profileVisibility: 'public',
              collaborationStatus: 'open',
              authMethods: {
                password: false,
                oauth2: [providerId]
              },
              notificationPreferences: {
                email: true,
                push: true,
                matchNotifications: true,
                messageNotifications: true,
                eventNotifications: true
              }
            },
            metadata: {
              createdAt: new Date().toISOString(),
              lastActive: new Date().toISOString(),
              profileImageId: '',
              location: '',
              timezone: 'UTC',
              registrationMethod: 'oauth2',
              lastLoginMethod: 'oauth2',
              lastOAuth2Provider: providerId
            }
          } as Omit<User, 'password'>
        };
      }

      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword,
        token: this.generateToken(user.id),
        message: 'OAuth2 login successful',
        authMethod: 'oauth2',
        provider: providerId
      };

    } catch (error) {
      console.error('OAuth2 login error:', error);
      return {
        success: false,
        message: 'OAuth2 authentication failed: ' + (error as Error).message
      };
    }
  }

  // Complete OAuth2 registration
  async registerWithOAuth2(data: OAuth2RegisterData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = this.users.find(
        u => u.email.toLowerCase() === data.oauth2User.email.toLowerCase()
      );

      if (existingUser) {
        return {
          success: false,
          message: 'An account with this email already exists'
        };
      }

      // Generate new user ID
      const newUserId = `user_${(this.users.length + 1).toString().padStart(3, '0')}`;
      
      // Create new user object
      const newUser: User = {
        id: newUserId,
        email: data.oauth2User.email,
        personalInfo: {
          firstName: data.oauth2User.firstName || '',
          lastName: data.oauth2User.lastName || '',
          phone: data.personalInfo?.phone || '',
          dateOfBirth: data.personalInfo?.dateOfBirth || ''
        },
        academicInfo: {
          ...data.academicInfo,
          currentGPA: 0,
          publications: 0,
          conferences: 0
        },
        profileInfo: {
          ...data.profileInfo,
          availability: 'Available for collaboration',
          collaborationPreferences: ['Co-authoring papers', 'Joint research projects']
        },
        contactInfo: {
          github: data.oauth2User.provider === 'github' ? 
            `https://github.com/${data.oauth2User.raw.login}` : undefined
        },
        oauthProviders: {
          [data.oauth2User.provider]: {
            id: data.oauth2User.providerId,
            email: data.oauth2User.email,
            verified: true,
            connectedAt: new Date().toISOString(),
            profileData: data.oauth2User.raw
          }
        },
        accountSettings: {
          isVerified: oauth2Service.isUniversityEmail(data.oauth2User.email),
          profileVisibility: 'public',
          collaborationStatus: 'open',
          authMethods: {
            password: false,
            oauth2: [data.oauth2User.provider]
          },
          notificationPreferences: {
            email: true,
            push: true,
            matchNotifications: true,
            messageNotifications: true,
            eventNotifications: true
          }
        },
        metadata: {
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          profileImageId: `${newUserId}_profile.jpg`,
          location: 'Location not specified',
          timezone: 'UTC',
          registrationMethod: 'oauth2',
          lastLoginMethod: 'oauth2',
          lastOAuth2Provider: data.oauth2User.provider
        }
      };

      // Add to users array
      this.users.push(newUser);

      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        user: userWithoutPassword,
        token: this.generateToken(newUser.id),
        message: 'OAuth2 registration successful',
        authMethod: 'oauth2',
        provider: data.oauth2User.provider
      };

    } catch (error) {
      console.error('OAuth2 registration error:', error);
      return {
        success: false,
        message: 'OAuth2 registration failed: ' + (error as Error).message
      };
    }
  }

  // Traditional password login (fallback)
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const user = this.users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Check if user has a password set
      if (!user.password) {
        return {
          success: false,
          message: 'This account uses OAuth2 authentication. Please login with your connected provider.'
        };
      }

      // Verify password (handle both hashed and plain text for testing)
      let isValidPassword = false;
      if (user.password.includes(':')) {
        // Hashed password
        isValidPassword = await this.verifyPassword(credentials.password, user.password);
      } else {
        // Plain text password (for demo/testing)
        isValidPassword = credentials.password === user.password;
      }
      
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Update last active and login method
      user.metadata.lastActive = new Date().toISOString();
      user.metadata.lastLoginMethod = 'password';

      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword,
        token: this.generateToken(user.id),
        message: 'Login successful',
        authMethod: 'password'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  // Traditional password registration
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Check if email already exists
      const existingUser = this.users.find(
        u => u.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        return {
          success: false,
          message: 'An account with this email already exists'
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Generate new user ID
      const newUserId = `user_${(this.users.length + 1).toString().padStart(3, '0')}`;
      
      // Create new user object
      const newUser: User = {
        id: newUserId,
        email: userData.email,
        password: hashedPassword,
        personalInfo: userData.personalInfo,
        academicInfo: {
          ...userData.academicInfo,
          currentGPA: 0,
          publications: 0,
          conferences: 0
        },
        profileInfo: {
          ...userData.profileInfo,
          availability: 'Available for collaboration',
          collaborationPreferences: ['Co-authoring papers', 'Joint research projects']
        },
        contactInfo: {},
        accountSettings: {
          isVerified: oauth2Service.isUniversityEmail(userData.email),
          profileVisibility: 'public',
          collaborationStatus: 'open',
          authMethods: {
            password: true,
            oauth2: []
          },
          notificationPreferences: {
            email: true,
            push: true,
            matchNotifications: true,
            messageNotifications: true,
            eventNotifications: true
          }
        },
        metadata: {
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          profileImageId: `${newUserId}_profile.jpg`,
          location: 'Location not specified',
          timezone: 'UTC',
          registrationMethod: 'password'
        }
      };

      // Add to users array
      this.users.push(newUser);

      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        user: userWithoutPassword,
        token: this.generateToken(newUser.id),
        message: 'Registration successful',
        authMethod: 'password'
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  }

  // Update user with OAuth2 data
  private async updateUserWithOAuth2Data(user: User, oauth2User: OAuth2User): Promise<User> {
    const providerId = oauth2User.provider;
    
    // Initialize oauthProviders if it doesn't exist
    if (!user.oauthProviders) {
      user.oauthProviders = {};
    }

    // Update OAuth2 provider data
    user.oauthProviders[providerId] = {
      id: oauth2User.providerId,
      email: oauth2User.email,
      verified: true,
      connectedAt: user.oauthProviders[providerId]?.connectedAt || new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      profileData: oauth2User.raw
    };

    // Update auth methods
    if (!user.accountSettings.authMethods.oauth2.includes(providerId)) {
      user.accountSettings.authMethods.oauth2.push(providerId);
    }

    // Update profile picture if available and not set
    if (oauth2User.picture && !user.metadata.profileImageId) {
      user.metadata.profileImageId = oauth2User.picture;
    }

    // Update GitHub link if provider is GitHub
    if (providerId === 'github' && oauth2User.raw.login) {
      user.contactInfo.github = `https://github.com/${oauth2User.raw.login}`;
    }

    return user;
  }

  // Rest of the existing methods...
  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Generate authentication token
  private generateToken(userId: string): string {
    return `token_${userId}_${Date.now()}`;
  }

  // Check if user can use OAuth2
  canUseOAuth2(email: string): boolean {
    return oauth2Service.isUniversityEmail(email);
  }

  // Get recommended OAuth2 providers for email
  getRecommendedProviders(email: string): string[] {
    const providers: string[] = [];
    
    if (oauth2Service.isUniversityEmail(email)) {
      providers.push('google', 'microsoft');
    }
    
    // Always suggest ORCID for academic users
    providers.push('orcid');
    
    // GitHub for technical researchers
    if (email.includes('cs.') || email.includes('cse.') || email.includes('eecs.')) {
      providers.push('github');
    }
    
    return providers;
  }
}

export const enhancedDatabaseService = new EnhancedDatabaseService();
export default enhancedDatabaseService;