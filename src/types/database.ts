// Database Types for PhD Collaboration App

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
}

export interface AcademicInfo {
  university: string;
  department: string;
  degreeLevel: 'PhD' | 'Masters' | 'Postdoc' | 'Professor';
  yearOfStudy: number;
  expectedGraduation: string;
  advisor: string;
  researchAreas: string[];
  currentGPA: number;
  publications: number;
  conferences: number;
}

export interface ProfileInfo {
  bio: string;
  skills: string[];
  languages: string[];
  interests: string[];
  availability: 'Available for collaboration' | 'Limited availability' | 'Not available' | 'Highly available';
  collaborationPreferences: string[];
}

export interface ContactInfo {
  linkedIn?: string;
  github?: string;
  orcid?: string;
  googleScholar?: string;
  researchGate?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  matchNotifications: boolean;
  messageNotifications: boolean;
  eventNotifications: boolean;
}

export interface AccountSettings {
  isVerified: boolean;
  profileVisibility: 'public' | 'private' | 'limited';
  collaborationStatus: 'open' | 'selective' | 'limited' | 'closed';
  notificationPreferences: NotificationPreferences;
}

export interface UserMetadata {
  createdAt: string;
  lastActive: string;
  profileImageId: string;
  location: string;
  timezone: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  password: string;
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  profileInfo: ProfileInfo;
  contactInfo: ContactInfo;
  accountSettings: AccountSettings;
  metadata: UserMetadata;
}

export interface PublicUser extends Omit<DatabaseUser, 'password'> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData extends LoginCredentials {
  personalInfo: PersonalInfo;
  academicInfo: Omit<AcademicInfo, 'currentGPA' | 'publications' | 'conferences'>;
  profileInfo: Omit<ProfileInfo, 'availability' | 'collaborationPreferences'>;
}

export interface AuthenticationResponse {
  success: boolean;
  user?: PublicUser;
  token?: string;
  message?: string;
}

export interface SearchQuery {
  researchAreas?: string[];
  university?: string;
  department?: string;
  skills?: string[];
  collaborationStatus?: string;
  degreeLevel?: string;
  location?: string;
}

export interface DatabaseStats {
  totalUsers: number;
  verifiedUsers: number;
  universitiesCount: number;
  departmentsCount: number;
  researchAreasCount: number;
}

export interface UsersDatabase {
  users: DatabaseUser[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalUsers: number;
    schemaVersion: string;
  };
}

// Utility types for partial updates
export type UserUpdate = Partial<Omit<DatabaseUser, 'id' | 'password'>>;
export type ProfileUpdate = Partial<Pick<DatabaseUser, 'personalInfo' | 'academicInfo' | 'profileInfo' | 'contactInfo'>>;
export type SettingsUpdate = Partial<Pick<DatabaseUser, 'accountSettings'>>;

// Research Areas enum for type safety
export enum ResearchArea {
  MACHINE_LEARNING = 'Machine Learning',
  ARTIFICIAL_INTELLIGENCE = 'Artificial Intelligence',
  COMPUTER_VISION = 'Computer Vision',
  NATURAL_LANGUAGE_PROCESSING = 'Natural Language Processing',
  QUANTUM_COMPUTING = 'Quantum Computing',
  CRYPTOGRAPHY = 'Cryptography',
  DISTRIBUTED_SYSTEMS = 'Distributed Systems',
  BIOMEDICAL_ENGINEERING = 'Biomedical Engineering',
  TISSUE_ENGINEERING = 'Tissue Engineering',
  REGENERATIVE_MEDICINE = 'Regenerative Medicine',
  COGNITIVE_PSYCHOLOGY = 'Cognitive Psychology',
  NEUROSCIENCE = 'Neuroscience',
  HUMAN_COMPUTER_INTERACTION = 'Human-Computer Interaction',
  ROBOTICS = 'Robotics',
  AUTONOMOUS_SYSTEMS = 'Autonomous Systems',
  DATA_SCIENCE = 'Data Science',
  CYBERSECURITY = 'Cybersecurity',
  SOFTWARE_ENGINEERING = 'Software Engineering',
  BLOCKCHAIN = 'Blockchain',
  HEALTHCARE_AI = 'Healthcare AI'
}

// Skills enum for type safety
export enum TechnicalSkill {
  PYTHON = 'Python',
  JAVASCRIPT = 'JavaScript',
  TYPESCRIPT = 'TypeScript',
  CPP = 'C++',
  JAVA = 'Java',
  R = 'R',
  MATLAB = 'MATLAB',
  TENSORFLOW = 'TensorFlow',
  PYTORCH = 'PyTorch',
  REACT = 'React',
  NODE_JS = 'Node.js',
  DOCKER = 'Docker',
  KUBERNETES = 'Kubernetes',
  AWS = 'AWS',
  GCP = 'Google Cloud Platform',
  AZURE = 'Microsoft Azure',
  GIT = 'Git',
  SQL = 'SQL',
  MONGODB = 'MongoDB',
  POSTGRESQL = 'PostgreSQL'
}

// University enum for common universities
export enum University {
  STANFORD = 'Stanford University',
  MIT = 'MIT',
  HARVARD = 'Harvard University',
  UC_BERKELEY = 'UC Berkeley',
  CMU = 'Carnegie Mellon University',
  CALTECH = 'California Institute of Technology',
  PRINCETON = 'Princeton University',
  YALE = 'Yale University',
  COLUMBIA = 'Columbia University',
  UNIVERSITY_OF_CHICAGO = 'University of Chicago'
}

export default DatabaseUser;