import usersData from '../../database/PhD_Collab_Users/users.json';

export interface User {
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
  accountSettings: {
    isVerified: boolean;
    profileVisibility: string;
    collaborationStatus: string;
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

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  message?: string;
}

class DatabaseService {
  private users: User[] = usersData.users;

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const user = this.users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && 
             u.password === credentials.password
      );

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Update last active timestamp
      user.metadata.lastActive = new Date().toISOString();

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword,
        token: this.generateToken(user.id),
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

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

      // Generate new user ID
      const newUserId = `user_${(this.users.length + 1).toString().padStart(3, '0')}`;
      
      // Create new user object
      const newUser: User = {
        id: newUserId,
        email: userData.email,
        password: userData.password,
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
          isVerified: false,
          profileVisibility: 'public',
          collaborationStatus: 'open',
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
          timezone: 'UTC'
        }
      };

      // Add to users array (in a real app, this would save to database)
      this.users.push(newUser);

      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        user: userWithoutPassword,
        token: this.generateToken(newUser.id),
        message: 'Registration successful'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  }

  // User Management Methods
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

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Update user data
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      this.users[userIndex].metadata.lastActive = new Date().toISOString();

      const { password, ...userWithoutPassword } = this.users[userIndex];

      return {
        success: true,
        user: userWithoutPassword,
        message: 'User updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update user'
      };
    }
  }

  // Search and Matching Methods
  async searchUsers(query: {
    researchAreas?: string[];
    university?: string;
    department?: string;
    skills?: string[];
    collaborationStatus?: string;
  }): Promise<Omit<User, 'password'>[]> {
    let filteredUsers = this.users.filter(user => {
      if (query.researchAreas && query.researchAreas.length > 0) {
        const hasMatchingArea = query.researchAreas.some(area =>
          user.academicInfo.researchAreas.some(userArea =>
            userArea.toLowerCase().includes(area.toLowerCase())
          )
        );
        if (!hasMatchingArea) return false;
      }

      if (query.university && !user.academicInfo.university.toLowerCase().includes(query.university.toLowerCase())) {
        return false;
      }

      if (query.department && !user.academicInfo.department.toLowerCase().includes(query.department.toLowerCase())) {
        return false;
      }

      if (query.skills && query.skills.length > 0) {
        const hasMatchingSkill = query.skills.some(skill =>
          user.profileInfo.skills.some(userSkill =>
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasMatchingSkill) return false;
      }

      if (query.collaborationStatus && user.accountSettings.collaborationStatus !== query.collaborationStatus) {
        return false;
      }

      return true;
    });

    return filteredUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Utility Methods
  private generateToken(userId: string): string {
    // In a real app, this would be a proper JWT token
    return `token_${userId}_${Date.now()}`;
  }

  async validateToken(token: string): Promise<string | null> {
    // Simple token validation (in real app, would validate JWT)
    const parts = token.split('_');
    if (parts.length === 3 && parts[0] === 'token') {
      return parts[1]; // Return user ID
    }
    return null;
  }

  // Statistics Methods
  async getDatabaseStats(): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    universitiesCount: number;
    departmentsCount: number;
    researchAreasCount: number;
  }> {
    const universities = new Set(this.users.map(u => u.academicInfo.university));
    const departments = new Set(this.users.map(u => u.academicInfo.department));
    const researchAreas = new Set(this.users.flatMap(u => u.academicInfo.researchAreas));

    return {
      totalUsers: this.users.length,
      verifiedUsers: this.users.filter(u => u.accountSettings.isVerified).length,
      universitiesCount: universities.size,
      departmentsCount: departments.size,
      researchAreasCount: researchAreas.size
    };
  }
}

export const databaseService = new DatabaseService();
export default databaseService;