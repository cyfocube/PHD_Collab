export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  university: string;
  department: string;
  degree: 'PhD' | 'Postdoc' | 'Masters' | 'Professor';
  researchAreas: string[];
  skills: string[];
  bio: string;
  orcidId?: string;
  linkedinProfile?: string;
  researchGateProfile?: string;
  publications: Publication[];
  isVerified: boolean;
  matchingPreferences: MatchingPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  citations?: number;
  doi?: string;
}

export interface MatchingPreferences {
  preferredCollaborationType: 'research' | 'co-authoring' | 'mentorship' | 'all';
  careerStages: ('PhD' | 'Postdoc' | 'Professor')[];
  geographicPreference: 'local' | 'national' | 'international' | 'no-preference';
  timeCommitment: 'low' | 'medium' | 'high';
  communicationStyle: 'formal' | 'casual' | 'mixed';
}

export interface Researcher {
  id: string;
  user: User;
  compatibilityScore: number;
  synergies: string[];
  complementarySkills: string[];
  sharedInterests: string[];
  collaborationPotential: number;
  matchingReasons: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  collaborators: User[];
  researchArea: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  milestones: Milestone[];
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string[];
}

export interface Document {
  id: string;
  name: string;
  type: 'paper' | 'data' | 'code' | 'presentation' | 'other';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'file' | 'collaboration-request';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'conference' | 'workshop' | 'hackathon' | 'seminar' | 'networking';
  date: string;
  location: string;
  isVirtual: boolean;
  registrationUrl?: string;
  relevantFields: string[];
  organizer: string;
}

export interface CollaborationRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  projectTitle: string;
  projectDescription: string;
  proposedRole: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}