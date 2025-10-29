# PhD Collaboration App Database

## Overview
This is a JSON-based database structure for the Academic Collaboration Network app, designed to store PhD student profiles and facilitate research collaboration matching.

## Database Structure

### Main Database File
- **Location**: `/database/PhD_Collab_Users/users.json`
- **Format**: JSON
- **Purpose**: Stores all user account information

### Images Directory
- **Location**: `/database/PhD_Collab_Users/images/`
- **Format**: Base64 encoded JPEG images
- **Naming Convention**: `{userId}_profile.jpg`

## User Schema

### Core Fields
```json
{
  "id": "string",           // Unique identifier (user_001, user_002, etc.)
  "email": "string",        // Primary login credential
  "password": "string",     // Authentication (in production, would be hashed)
}
```

### Personal Information
```json
"personalInfo": {
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "dateOfBirth": "string"   // ISO date format
}
```

### Academic Information
```json
"academicInfo": {
  "university": "string",
  "department": "string",
  "degreeLevel": "string",        // PhD, Masters, etc.
  "yearOfStudy": "number",
  "expectedGraduation": "string", // YYYY-MM format
  "advisor": "string",
  "researchAreas": ["string"],    // Array of research interests
  "currentGPA": "number",
  "publications": "number",
  "conferences": "number"
}
```

### Profile Information
```json
"profileInfo": {
  "bio": "string",                      // Personal/academic biography
  "skills": ["string"],                 // Technical and academic skills
  "languages": ["string"],              // Spoken languages
  "interests": ["string"],              // Research interests
  "availability": "string",             // Collaboration availability status
  "collaborationPreferences": ["string"] // Types of collaboration sought
}
```

### Contact Information
```json
"contactInfo": {
  "linkedIn": "string",       // Optional social/professional links
  "github": "string",
  "orcid": "string",
  "googleScholar": "string",
  "researchGate": "string"
}
```

### Account Settings
```json
"accountSettings": {
  "isVerified": "boolean",              // Email/institution verification status
  "profileVisibility": "string",       // public, private, limited
  "collaborationStatus": "string",     // open, selective, limited, closed
  "notificationPreferences": {
    "email": "boolean",
    "push": "boolean",
    "matchNotifications": "boolean",
    "messageNotifications": "boolean",
    "eventNotifications": "boolean"
  }
}
```

### Metadata
```json
"metadata": {
  "createdAt": "string",        // ISO timestamp
  "lastActive": "string",       // ISO timestamp
  "profileImageId": "string",   // Image filename
  "location": "string",         // Geographic location
  "timezone": "string"          // Timezone identifier
}
```

## Sample Users

The database includes 5 sample users representing different universities and research areas:

1. **Sarah Johnson** (Stanford) - AI/Healthcare
2. **Alex Chen** (MIT) - Quantum Computing/Cryptography
3. **Maria Gonzalez** (UC Berkeley) - Bioengineering
4. **David Kim** (Harvard) - Psychology/HCI
5. **Priya Patel** (CMU) - Robotics/Computer Vision

## API Service

### Database Service (`src/services/databaseService.ts`)

#### Authentication Methods
- `login(credentials)` - User authentication
- `register(userData)` - New user registration
- `validateToken(token)` - Token validation

#### User Management
- `getUserById(userId)` - Retrieve user by ID
- `getUserByEmail(email)` - Retrieve user by email
- `getAllUsers()` - Get all users (password excluded)
- `updateUser(userId, updates)` - Update user information

#### Search & Matching
- `searchUsers(query)` - Advanced user search with filters:
  - Research areas
  - University
  - Department
  - Skills
  - Collaboration status

#### Statistics
- `getDatabaseStats()` - Database analytics and metrics

## Security Considerations

⚠️ **Current Implementation is for Development Only**

- Passwords are stored in plain text
- No encryption or hashing implemented
- Tokens are simple strings, not JWT
- No rate limiting or authentication middleware

### Production Requirements
- Hash passwords using bcrypt or similar
- Implement proper JWT tokens
- Add input validation and sanitization
- Implement rate limiting
- Add audit logging
- Use proper database (PostgreSQL, MongoDB, etc.)
- Implement proper authentication middleware

## Usage Examples

### Login
```typescript
const result = await databaseService.login({
  email: "demo@university.edu",
  password: "password123"
});
```

### Register New User
```typescript
const result = await databaseService.register({
  email: "newuser@university.edu",
  password: "securepassword",
  personalInfo: { /* ... */ },
  academicInfo: { /* ... */ },
  profileInfo: { /* ... */ }
});
```

### Search for Collaborators
```typescript
const matches = await databaseService.searchUsers({
  researchAreas: ["Machine Learning", "AI"],
  collaborationStatus: "open"
});
```

## Integration with GitHub Database

This structure is designed to work with the referenced GitHub database repository:
- **Repository**: https://github.com/cyfocube/C_DataBase.git
- **Format**: JSON files compatible with GitHub file storage
- **Images**: Base64 encoded for GitHub compatibility
- **Structure**: Modular design for easy synchronization with remote repository

## Future Enhancements

1. **Database Migration**: Move to proper database system
2. **Real-time Sync**: Implement GitHub API integration
3. **Image Optimization**: Implement proper image storage and optimization
4. **Advanced Matching**: AI-powered collaboration matching algorithms
5. **Data Validation**: Comprehensive input validation and type checking
6. **Backup System**: Automated backup and recovery procedures