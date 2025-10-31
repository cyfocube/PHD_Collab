# ProHub - Academic Collaboration Network

## Sign Up Functionality

### Overview
The ProHub sign-up process is a comprehensive 5-step wizard that captures all necessary information for academic professionals to create detailed profiles for collaboration.

### Sign-Up Process Steps

#### Step 1: Account Information
- Email address
- Password 
- Password confirmation

#### Step 2: Personal Information
- First Name
- Last Name
- Phone Number
- Date of Birth (YYYY-MM-DD format)
- Profile Picture Upload (optional)

#### Step 3: Academic Information
- University
- Department
- Degree Level (e.g., PhD, Masters, etc.)
- Year of Study
- Expected Graduation (YYYY-MM format)
- Advisor Name
- Current GPA
- Number of Publications
- Number of Conference Presentations
- Research Areas (can add multiple via chips)

#### Step 4: Profile Information
- Bio/Description
- Skills (multiple via chips)
- Languages (multiple via chips)
- Research Interests (multiple via chips)
- Collaboration Preferences (multiple via chips)

#### Step 5: Contact Information
- LinkedIn URL
- GitHub URL
- ORCID ID
- Google Scholar URL
- ResearchGate URL

### Features

#### User Data Storage
- All user data is securely stored locally using `expo-secure-store`
- Automatic user ID generation for each registration
- Password validation and email uniqueness checking
- Comprehensive data validation before registration

#### Profile Image Upload
- Users can upload a profile picture from their device's gallery
- Image picker integration with proper permissions handling
- Profile image ID is automatically generated and stored

#### Dynamic Form Fields
- Chip-based input for arrays (research areas, skills, languages, interests, collaboration preferences)
- Easy addition and removal of items from arrays
- Real-time form validation and error display

#### Navigation Integration
- Seamless navigation between signup steps
- Back/Next button functionality
- Automatic login after successful registration
- Return to login screen option

### Data Structure
The signup process captures data that matches the following structure:

```json
{
  "id": "user_generated_id",
  "email": "user@university.edu",
  "password": "secure_password",
  "personalInfo": {
    "firstName": "First",
    "lastName": "Last",
    "phone": "+1-555-0123",
    "dateOfBirth": "1995-03-15"
  },
  "academicInfo": {
    "university": "University Name",
    "department": "Department",
    "degreeLevel": "PhD",
    "yearOfStudy": 3,
    "expectedGraduation": "2026-06",
    "advisor": "Dr. Advisor Name",
    "researchAreas": ["Area 1", "Area 2"],
    "currentGPA": 3.85,
    "publications": 5,
    "conferences": 3
  },
  "profileInfo": {
    "bio": "User bio description",
    "skills": ["Skill 1", "Skill 2"],
    "languages": ["Language 1", "Language 2"],
    "interests": ["Interest 1", "Interest 2"],
    "availability": "Available for collaboration",
    "collaborationPreferences": ["Preference 1", "Preference 2"]
  },
  "contactInfo": {
    "linkedIn": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "orcid": "0000-0000-0000-0001",
    "googleScholar": "https://scholar.google.com/citations?user=id",
    "researchGate": "https://researchgate.net/profile/username"
  },
  "accountSettings": {
    "isVerified": false,
    "profileVisibility": "public",
    "collaborationStatus": "open",
    "notificationPreferences": {
      "email": true,
      "push": true,
      "matchNotifications": true,
      "messageNotifications": true,
      "eventNotifications": true
    }
  },
  "metadata": {
    "createdAt": "2024-01-15T10:30:00Z",
    "lastActive": "2024-01-15T10:30:00Z",
    "profileImageId": "user_timestamp_profile.jpg",
    "location": "",
    "timezone": "America/Los_Angeles"
  }
}
```

### Usage

1. From the login screen, tap "Sign up" to navigate to the registration process
2. Complete all 5 steps of the signup wizard
3. Upload a profile picture if desired
4. Review and create your account
5. Upon successful registration, you'll be automatically logged in

### Technical Implementation

- **Frontend**: React Native with react-native-paper components
- **Navigation**: React Navigation stack navigator
- **Storage**: expo-secure-store for secure local data persistence
- **Image Handling**: expo-image-picker for profile picture uploads
- **Validation**: Comprehensive form validation and error handling
- **Authentication**: Integration with existing AuthService for seamless login after registration

### Testing

To test the signup functionality:

1. Scan the QR code with Expo Go app
2. Navigate to the login screen and tap "Sign up"
3. Complete the multi-step form with your information
4. Test various scenarios (validation errors, missing fields, etc.)
5. Verify successful registration and automatic login

---

*The ProHub signup system provides a comprehensive onboarding experience for academic professionals, ensuring all necessary information is captured for effective collaboration matching.*