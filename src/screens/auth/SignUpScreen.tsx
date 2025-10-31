import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import RegistrationService from '../../services/registrationService';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
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
  profileImage?: string;
}

const getStepColor = (step: number): string => {
  const colors = {
    1: '#EF4444', // Red for Account Info
    2: '#F97316', // Orange for Personal Info  
    3: '#EAB308', // Yellow for Academic Info
    4: '#22C55E', // Green for Profile Info
    5: '#6366F1', // Purple for Contact Info
  };
  return colors[step as keyof typeof colors] || '#6366F1';
};

export default function SignUpScreen({ navigation }: any) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
    },
    academicInfo: {
      university: '',
      department: '',
      degreeLevel: 'PhD',
      yearOfStudy: 1,
      expectedGraduation: '',
      advisor: '',
      researchAreas: [],
      currentGPA: 0,
      publications: 0,
      conferences: 0,
    },
    profileInfo: {
      bio: '',
      skills: [],
      languages: [],
      interests: [],
      availability: 'Available for collaboration',
      collaborationPreferences: [],
    },
    contactInfo: {
      linkedIn: '',
      github: '',
      orcid: '',
      googleScholar: '',
      researchGate: '',
    },
  });

  const [tempInputs, setTempInputs] = useState({
    researchArea: '',
    skill: '',
    language: '',
    interest: '',
    collaboration: '',
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const addToArray = (field: keyof typeof tempInputs, targetField: string) => {
    const value = tempInputs[field].trim();
    if (value) {
      const keys = targetField.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current: any = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        const finalKey = keys[keys.length - 1];
        if (!current[finalKey].includes(value)) {
          current[finalKey] = [...current[finalKey], value];
        }
        return newData;
      });
      setTempInputs(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removeFromArray = (targetField: string, index: number) => {
    const keys = targetField.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      const finalKey = keys[keys.length - 1];
      current[finalKey] = current[finalKey].filter((_: any, i: number) => i !== index);
      return newData;
    });
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate required fields
    const validationErrors = RegistrationService.validateUserData(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create user object with metadata
      const newUser = {
        id: RegistrationService.generateUserId(),
        email: formData.email,
        password: formData.password,
        personalInfo: formData.personalInfo,
        academicInfo: formData.academicInfo,
        profileInfo: formData.profileInfo,
        contactInfo: formData.contactInfo,
        accountSettings: {
          isVerified: false,
          profileVisibility: 'public',
          collaborationStatus: 'open',
          notificationPreferences: {
            email: true,
            push: true,
            matchNotifications: true,
            messageNotifications: true,
            eventNotifications: true,
          },
        },
        metadata: {
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          profileImageId: profileImage ? `user_${Date.now()}_profile.jpg` : null,
          location: '', // Will be filled based on user location
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      // Register user using the registration service
      const result = await RegistrationService.registerUser(newUser);
      
      if (result.success && result.user) {
        Alert.alert(
          'Welcome to ProHub! 🎉',
          `Account created successfully for ${result.user.personalInfo.firstName} ${result.user.personalInfo.lastName}!\n\nUniversity: ${result.user.academicInfo.university}\nDepartment: ${result.user.academicInfo.department}`,
          [{ 
            text: 'Continue', 
            onPress: () => {
              login(result.user);
            }
          }]
        );
      } else {
        setError(result.error || 'Failed to create account. Please try again.');
      }
    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        theme={{ roundness: 10 }}
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <TextInput
        label="First Name"
        value={formData.personalInfo.firstName}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          personalInfo: { ...prev.personalInfo, firstName: text }
        }))}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Last Name"
        value={formData.personalInfo.lastName}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          personalInfo: { ...prev.personalInfo, lastName: text }
        }))}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Phone"
        value={formData.personalInfo.phone}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          personalInfo: { ...prev.personalInfo, phone: text }
        }))}
        mode="outlined"
        style={styles.input}
        keyboardType="phone-pad"
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Date of Birth (YYYY-MM-DD)"
        value={formData.personalInfo.dateOfBirth}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          personalInfo: { ...prev.personalInfo, dateOfBirth: text }
        }))}
        mode="outlined"
        style={styles.input}
        placeholder="1995-03-15"
        theme={{ roundness: 10 }}
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerText}>
          {profileImage ? 'Change Profile Picture' : 'Upload Profile Picture'}
        </Text>
      </TouchableOpacity>
      
      {profileImage && (
        <Text style={styles.imageSelectedText}>✓ Profile picture selected</Text>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <TextInput
        label="University"
        value={formData.academicInfo.university}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, university: text }
        }))}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Department"
        value={formData.academicInfo.department}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, department: text }
        }))}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Degree Level"
        value={formData.academicInfo.degreeLevel}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, degreeLevel: text }
        }))}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Year of Study"
        value={formData.academicInfo.yearOfStudy.toString()}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, yearOfStudy: parseInt(text) || 0 }
        }))}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Expected Graduation (YYYY-MM)"
        value={formData.academicInfo.expectedGraduation}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, expectedGraduation: text }
        }))}
        mode="outlined"
        style={styles.input}
        placeholder="2026-06"
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Advisor"
        value={formData.academicInfo.advisor}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, advisor: text }
        }))}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Current GPA"
        value={formData.academicInfo.currentGPA > 0 ? formData.academicInfo.currentGPA.toString() : ''}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, currentGPA: parseFloat(text) || 0 }
        }))}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        placeholder="3.85"
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Publications"
        value={formData.academicInfo.publications > 0 ? formData.academicInfo.publications.toString() : ''}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, publications: parseInt(text) || 0 }
        }))}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        placeholder="5"
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Conferences"
        value={formData.academicInfo.conferences > 0 ? formData.academicInfo.conferences.toString() : ''}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, conferences: parseInt(text) || 0 }
        }))}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        placeholder="3"
        theme={{ roundness: 10 }}
      />

      {/* Research Areas */}
      <View style={styles.arrayInputContainer}>
        <TextInput
          label="Add Research Area"
          value={tempInputs.researchArea}
          onChangeText={(text) => setTempInputs(prev => ({ ...prev, researchArea: text }))}
          mode="outlined"
          style={styles.arrayInput}
          theme={{ roundness: 10 }}
          right={
            <TextInput.Icon
              icon="plus"
              onPress={() => addToArray('researchArea', 'academicInfo.researchAreas')}
            />
          }
        />
        <View style={styles.chipContainer}>
          {formData.academicInfo.researchAreas.map((area, index) => (
            <Chip
              key={index}
              onClose={() => removeFromArray('academicInfo.researchAreas', index)}
              style={styles.chip}
            >
              {area}
            </Chip>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <TextInput
        label="Bio"
        value={formData.profileInfo.bio}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          profileInfo: { ...prev.profileInfo, bio: text }
        }))}
        mode="outlined"
        style={styles.textArea}
        multiline
        numberOfLines={4}
        placeholder="PhD student researching AI applications in healthcare. Passionate about developing ML models for medical diagnosis and treatment optimization."
        theme={{ roundness: 10 }}
      />

      {/* Skills */}
      <View style={styles.arrayInputContainer}>
        <TextInput
          label="Add Skill"
          value={tempInputs.skill}
          onChangeText={(text) => setTempInputs(prev => ({ ...prev, skill: text }))}
          mode="outlined"
          style={styles.arrayInput}
          theme={{ roundness: 10 }}
          right={
            <TextInput.Icon
              icon="plus"
              onPress={() => addToArray('skill', 'profileInfo.skills')}
            />
          }
        />
        <View style={styles.chipContainer}>
          {formData.profileInfo.skills.map((skill, index) => (
            <Chip
              key={index}
              onClose={() => removeFromArray('profileInfo.skills', index)}
              style={styles.chip}
            >
              {skill}
            </Chip>
          ))}
        </View>
      </View>

      {/* Languages */}
      <View style={styles.arrayInputContainer}>
        <TextInput
          label="Add Language"
          value={tempInputs.language}
          onChangeText={(text) => setTempInputs(prev => ({ ...prev, language: text }))}
          mode="outlined"
          style={styles.arrayInput}
          theme={{ roundness: 10 }}
          right={
            <TextInput.Icon
              icon="plus"
              onPress={() => addToArray('language', 'profileInfo.languages')}
            />
          }
        />
        <View style={styles.chipContainer}>
          {formData.profileInfo.languages.map((language, index) => (
            <Chip
              key={index}
              onClose={() => removeFromArray('profileInfo.languages', index)}
              style={styles.chip}
            >
              {language}
            </Chip>
          ))}
        </View>
      </View>

      {/* Interests */}
      <View style={styles.arrayInputContainer}>
        <TextInput
          label="Add Interest"
          value={tempInputs.interest}
          onChangeText={(text) => setTempInputs(prev => ({ ...prev, interest: text }))}
          mode="outlined"
          style={styles.arrayInput}
          theme={{ roundness: 10 }}
          right={
            <TextInput.Icon
              icon="plus"
              onPress={() => addToArray('interest', 'profileInfo.interests')}
            />
          }
        />
        <View style={styles.chipContainer}>
          {formData.profileInfo.interests.map((interest, index) => (
            <Chip
              key={index}
              onClose={() => removeFromArray('profileInfo.interests', index)}
              style={styles.chip}
            >
              {interest}
            </Chip>
          ))}
        </View>
      </View>

      {/* Collaboration Preferences */}
      <View style={styles.arrayInputContainer}>
        <TextInput
          label="Add Collaboration Preference"
          value={tempInputs.collaboration}
          onChangeText={(text) => setTempInputs(prev => ({ ...prev, collaboration: text }))}
          mode="outlined"
          style={styles.arrayInput}
          theme={{ roundness: 10 }}
          placeholder="Co-authoring papers, Joint research projects, etc."
          right={
            <TextInput.Icon
              icon="plus"
              onPress={() => addToArray('collaboration', 'profileInfo.collaborationPreferences')}
            />
          }
        />
        <View style={styles.chipContainer}>
          {formData.profileInfo.collaborationPreferences.map((pref, index) => (
            <Chip
              key={index}
              onClose={() => removeFromArray('profileInfo.collaborationPreferences', index)}
              style={styles.chip}
            >
              {pref}
            </Chip>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View>
      <TextInput
        label="LinkedIn URL"
        value={formData.contactInfo.linkedIn}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          contactInfo: { ...prev.contactInfo, linkedIn: text }
        }))}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="GitHub URL"
        value={formData.contactInfo.github}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          contactInfo: { ...prev.contactInfo, github: text }
        }))}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="ORCID"
        value={formData.contactInfo.orcid}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          contactInfo: { ...prev.contactInfo, orcid: text }
        }))}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="Google Scholar URL"
        value={formData.contactInfo.googleScholar}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          contactInfo: { ...prev.contactInfo, googleScholar: text }
        }))}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        theme={{ roundness: 10 }}
      />
      
      <TextInput
        label="ResearchGate URL"
        value={formData.contactInfo.researchGate}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          contactInfo: { ...prev.contactInfo, researchGate: text }
        }))}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        theme={{ roundness: 10 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.title}>
              Join ProHub
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Step {currentStep} of 5
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressWrapper}>
            <View style={styles.progressContainer}>
              {[1, 2, 3, 4, 5].map((step) => (
                <View
                  key={step}
                  style={[
                    styles.progressSegment,
                    {
                      backgroundColor: currentStep >= step 
                        ? getStepColor(step)
                        : '#333333'
                    }
                  ]}
                />
              ))}
            </View>
            <View style={styles.stepLabelsContainer}>
              {[
                'Account',
                'Personal', 
                'Academic',
                'Profile',
                'Contact'
              ].map((label, index) => (
                <Text
                  key={index}
                  style={[
                    styles.stepLabel,
                    {
                      color: currentStep > index + 1 
                        ? getStepColor(index + 1)
                        : currentStep === index + 1
                        ? '#FFFFFF'
                        : '#666666'
                    }
                  ]}
                >
                  {label}
                </Text>
              ))}
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Form Steps */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <Button
                mode="outlined"
                onPress={() => setCurrentStep(currentStep - 1)}
                style={styles.backButton}
              >
                Back
              </Button>
            )}
            
            {currentStep < 5 ? (
              <Button
                mode="contained"
                onPress={() => setCurrentStep(currentStep + 1)}
                style={styles.nextButton}
              >
                Next
              </Button>
            ) : (
              loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#6366F1" />
                  <Text style={styles.loadingText}>Creating account...</Text>
                </View>
              ) : (
                <Button
                  mode="contained"
                  onPress={handleSignUp}
                  style={styles.signUpButton}
                >
                  Create Account
                </Button>
              )
            )}
          </View>

          {/* Back to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text 
                style={styles.loginLink}
                onPress={() => navigation.goBack()}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#A1A1AA',
    textAlign: 'center',
  },
  progressWrapper: {
    marginBottom: 25,
  },
  progressContainer: {
    flexDirection: 'row',
    height: 3,
    marginBottom: 10,
    gap: 3,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: '#333333',
  },
  stepLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    flex: 1,
    opacity: 0.8,
  },
  stepTitle: {
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#1F1F1F',
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    height: 43,
  },
  textArea: {
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
  },
  arrayInputContainer: {
    marginBottom: 20,
  },
  arrayInput: {
    backgroundColor: '#1A1A1A',
    height: 43,
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#6366F1',
    marginBottom: 5,
  },
  imagePickerButton: {
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  imageSelectedText: {
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 16,
  },
  backButton: {
    flex: 1,
    borderColor: '#6366F1',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#6366F1',
  },
  signUpButton: {
    flex: 1,
    backgroundColor: '#6366F1',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 8,
    color: '#A1A1AA',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  loginLink: {
    color: '#6366F1',
    fontWeight: '600',
  },
});