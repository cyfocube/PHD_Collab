import * as SecureStore from 'expo-secure-store';

interface UserRegistrationData {
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
    linkedIn: string;
    github: string;
    orcid: string;
    googleScholar: string;
    researchGate: string;
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
    profileImageId: string | null;
    location: string;
    timezone: string;
  };
}

interface RegistrationResult {
  success: boolean;
  user?: UserRegistrationData;
  error?: string;
}

class RegistrationService {
  private static readonly USERS_STORAGE_KEY = 'prohub_registered_users';

  static async registerUser(userData: UserRegistrationData): Promise<RegistrationResult> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Get existing registered users
      let registeredUsers: UserRegistrationData[] = [];
      try {
        const storedUsers = await SecureStore.getItemAsync(this.USERS_STORAGE_KEY);
        if (storedUsers) {
          registeredUsers = JSON.parse(storedUsers);
        }
      } catch (error) {
        console.log('No existing users found, creating new storage');
      }

      // Add new user
      registeredUsers.push(userData);

      // Store updated users list
      await SecureStore.setItemAsync(this.USERS_STORAGE_KEY, JSON.stringify(registeredUsers));

      // Also store user data individually for easy access
      await SecureStore.setItemAsync(`user_${userData.id}`, JSON.stringify(userData));

      console.log(`User ${userData.personalInfo.firstName} ${userData.personalInfo.lastName} registered successfully!`);
      
      return {
        success: true,
        user: userData
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.'
      };
    }
  }

  static async getUserByEmail(email: string): Promise<UserRegistrationData | null> {
    try {
      const storedUsers = await SecureStore.getItemAsync(this.USERS_STORAGE_KEY);
      if (!storedUsers) return null;

      const users: UserRegistrationData[] = JSON.parse(storedUsers);
      return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  static async getAllRegisteredUsers(): Promise<UserRegistrationData[]> {
    try {
      const storedUsers = await SecureStore.getItemAsync(this.USERS_STORAGE_KEY);
      if (!storedUsers) return [];

      return JSON.parse(storedUsers);
    } catch (error) {
      console.error('Error getting all registered users:', error);
      return [];
    }
  }

  static async updateUser(userId: string, updatedData: Partial<UserRegistrationData>): Promise<RegistrationResult> {
    try {
      // Get existing users
      const registeredUsers = await this.getAllRegisteredUsers();
      const userIndex = registeredUsers.findIndex(user => user.id === userId);

      if (userIndex === -1) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Update user data
      registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updatedData };
      const updatedUser = registeredUsers[userIndex];

      // Store updated users list
      await SecureStore.setItemAsync(this.USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
      await SecureStore.setItemAsync(`user_${userId}`, JSON.stringify(updatedUser));

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: 'Failed to update user. Please try again.'
      };
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      // Get existing users
      const registeredUsers = await this.getAllRegisteredUsers();
      const filteredUsers = registeredUsers.filter(user => user.id !== userId);

      // Store updated users list
      await SecureStore.setItemAsync(this.USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
      
      // Remove individual user storage
      await SecureStore.deleteItemAsync(`user_${userId}`);

      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }

  static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static validateUserData(userData: Partial<UserRegistrationData>): string[] {
    const errors: string[] = [];

    if (!userData.email || !userData.email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (!userData.personalInfo?.firstName) {
      errors.push('First name is required');
    }

    if (!userData.personalInfo?.lastName) {
      errors.push('Last name is required');
    }

    if (!userData.academicInfo?.university) {
      errors.push('University is required');
    }

    if (!userData.academicInfo?.department) {
      errors.push('Department is required');
    }

    return errors;
  }
}

export default RegistrationService;
export type { UserRegistrationData, RegistrationResult };