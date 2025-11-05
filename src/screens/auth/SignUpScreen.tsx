import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Modal, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, Chip, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import RegistrationService from '../../services/registrationService';
import UniversitySearchInput from '../../components/UniversitySearchInput';

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

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 80; year <= currentYear - 18; year++) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years.reverse(); // Show recent years first
};

const countryCodes = [
  // North America
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  
  // Europe
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+48', country: 'Poland', flag: '🇵🇱' },
  { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
  { code: '+36', country: 'Hungary', flag: '🇭🇺' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+30', country: 'Greece', flag: '🇬🇷' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  
  // Asia
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+886', country: 'Taiwan', flag: '🇹🇼' },
  { code: '+853', country: 'Macau', flag: '🇲🇴' },
  { code: '+976', country: 'Mongolia', flag: '🇲🇳' },
  { code: '+7', country: 'Kazakhstan', flag: '🇰🇿' },
  { code: '+998', country: 'Uzbekistan', flag: '🇺🇿' },
  { code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: '+992', country: 'Tajikistan', flag: '🇹🇯' },
  { code: '+993', country: 'Turkmenistan', flag: '🇹🇲' },
  { code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
  { code: '+995', country: 'Georgia', flag: '🇬🇪' },
  { code: '+374', country: 'Armenia', flag: '🇦🇲' },
  
  // Middle East
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+972', country: 'Israel', flag: '🇮🇱' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+98', country: 'Iran', flag: '🇮🇷' },
  { code: '+964', country: 'Iraq', flag: '🇮�' },
  { code: '+962', country: 'Jordan', flag: '🇯🇴' },
  { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
  { code: '+963', country: 'Syria', flag: '🇸🇾' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+967', country: 'Yemen', flag: '🇾🇪' },
  
  // Africa
  { code: '+234', country: 'Nigeria', flag: '�🇳🇬' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { code: '+216', country: 'Tunisia', flag: '🇹🇳' },
  { code: '+213', country: 'Algeria', flag: '🇩🇿' },
  { code: '+218', country: 'Libya', flag: '🇱🇾' },
  { code: '+249', country: 'Sudan', flag: '🇸🇩' },
  { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+250', country: 'Rwanda', flag: '🇷�' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+225', country: 'Ivory Coast', flag: '🇨🇮' },
  { code: '+221', country: 'Senegal', flag: '🇸🇳' },
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+229', country: 'Benin', flag: '🇧🇯' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+220', country: 'Gambia', flag: '🇬🇲' },
  { code: '+224', country: 'Guinea', flag: '🇬🇳' },
  { code: '+245', country: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: '+238', country: 'Cape Verde', flag: '🇨🇻' },
  { code: '+232', country: 'Sierra Leone', flag: '🇸🇱' },
  { code: '+231', country: 'Liberia', flag: '🇱🇷' },
  { code: '+260', country: 'Zambia', flag: '🇿🇲' },
  { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
  { code: '+265', country: 'Malawi', flag: '🇲🇼' },
  { code: '+258', country: 'Mozambique', flag: '🇲🇿' },
  { code: '+264', country: 'Namibia', flag: '🇳�🇦' },
  { code: '+267', country: 'Botswana', flag: '🇧🇼' },
  { code: '+268', country: 'Eswatini', flag: '�🇿' },
  { code: '+266', country: 'Lesotho', flag: '🇱🇸' },
  
  // South America
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+54', country: 'Argentina', flag: '��🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+51', country: 'Peru', flag: '🇵🇪' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+591', country: 'Bolivia', flag: '�🇴' },
  { code: '+592', country: 'Guyana', flag: '🇬🇾' },
  { code: '+597', country: 'Suriname', flag: '🇸�🇷' },
  
  // Oceania
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+679', country: 'Fiji', flag: '🇫🇯' },
  { code: '+685', country: 'Samoa', flag: '🇼🇸' },
  { code: '+676', country: 'Tonga', flag: '🇹🇴' },
  { code: '+678', country: 'Vanuatu', flag: '🇻🇺' },
  { code: '+686', country: 'Kiribati', flag: '🇰🇮' },
  { code: '+687', country: 'New Caledonia', flag: '🇳🇨' },
  { code: '+689', country: 'French Polynesia', flag: '🇵🇫' },
  
  // Caribbean
  { code: '+1', country: 'Bahamas', flag: '🇧🇸' },
  { code: '+1', country: 'Barbados', flag: '🇧🇧' },
  { code: '+1', country: 'British Virgin Islands', flag: '🇻🇬' },
  { code: '+1', country: 'Cayman Islands', flag: '🇰🇾' },
  { code: '+1', country: 'Dominican Republic', flag: '🇩🇴' },
  { code: '+1', country: 'Jamaica', flag: '🇯🇲' },
  { code: '+1', country: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: '+590', country: 'Guadeloupe', flag: '🇬🇵' },
  { code: '+596', country: 'Martinique', flag: '🇲🇶' },
  { code: '+594', country: 'French Guiana', flag: '🇬🇫' },
  
  // Central America
  { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+506', country: 'Costa Rica', flag: '🇨�' },
  { code: '+507', country: 'Panama', flag: '🇵🇦' },
  { code: '+501', country: 'Belize', flag: '🇧🇿' },
];

export default function SignUpScreen({ navigation }: any) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [countryFlag, setCountryFlag] = useState('🇺🇸');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
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

  // Simple validation function - start with just checking if fields are not empty
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getValidationErrors = () => {
    const errors: string[] = [];
    
    switch (currentStep) {
      case 1:
        // Check for missing fields
        if (formData.email.length === 0) errors.push('Email is required');
        if (formData.password.length === 0) errors.push('Password is required');
        if (formData.confirmPassword.length === 0) errors.push('Confirm Password is required');
        
        // Check email format if provided
        if (formData.email.length > 0 && !isValidEmail(formData.email)) {
          errors.push('Email must be a valid email address');
        }
        
        // Check password length if provided
        if (formData.password.length > 0 && formData.password.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }
        
        // Check password confirmation if both passwords are provided
        if (formData.password.length > 0 && formData.confirmPassword.length > 0 && 
            formData.password !== formData.confirmPassword) {
          errors.push('Passwords must match');
        }
        break;
      
      case 2:
        if (formData.personalInfo.firstName.length === 0) errors.push('First Name is required');
        if (formData.personalInfo.lastName.length === 0) errors.push('Last Name is required');
        if (formData.personalInfo.phone.length === 0) errors.push('Phone is required');
        if (formData.personalInfo.dateOfBirth.length === 0) errors.push('Date of Birth is required');
        break;
      
      case 3:
        if (formData.academicInfo.university.length === 0) errors.push('University is required');
        if (formData.academicInfo.department.length === 0) errors.push('Field is required');
        if (formData.academicInfo.degreeLevel.length === 0) errors.push('Degree Level is required');
        break;
      
      case 4:
        if (formData.profileInfo.bio.length === 0) errors.push('Bio is required');
        break;
      
      case 5:
        // No required fields
        break;
    }
    
    return errors;
  };

  const isStepComplete = () => {
    return getValidationErrors().length === 0;
  };

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

  const handleDatePickerConfirm = () => {
    if (selectedMonth && selectedYear) {
      const dateString = `${selectedYear}-${selectedMonth}`;
      setFormData(prev => ({ 
        ...prev, 
        personalInfo: { ...prev.personalInfo, dateOfBirth: dateString }
      }));
    }
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    // Pre-populate with current values if they exist
    const currentDate = formData.personalInfo.dateOfBirth;
    if (currentDate && currentDate.includes('-')) {
      const [year, month] = currentDate.split('-');
      setSelectedYear(year);
      setSelectedMonth(month);
    }
    setShowDatePicker(true);
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
          `Account created successfully for ${result.user.personalInfo.firstName} ${result.user.personalInfo.lastName}!\n\nUniversity: ${result.user.academicInfo.university}\nField: ${result.user.academicInfo.department}`,
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
        onSubmitEditing={() => {
          console.log('🔴 Email field submitted via keyboard - BLOCKING');
          // Don't advance step on Enter/Submit
        }}
      />
      
      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        theme={{ roundness: 10 }}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      
      <TextInput
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
        mode="outlined"
        secureTextEntry={!showConfirmPassword}
        style={styles.input}
        theme={{ roundness: 10 }}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? "eye-off" : "eye"}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      {/* Profile Photo Section */}
      <View style={styles.profilePhotoContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.profilePhotoWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
          ) : (
            <View style={styles.placeholderPhoto}>
              <Text style={styles.placeholderText}>Add Photo</Text>
            </View>
          )}
          {profileImage && (
            <View style={styles.editIconContainer}>
              <IconButton
                icon="pencil"
                size={20}
                iconColor="white"
                style={styles.editIcon}
                onPress={pickImage}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

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
      
      <View style={styles.phoneInputContainer}>
        <TouchableOpacity 
          onPress={() => setShowCountryModal(true)}
          style={styles.countryCodeButton}
        >
          <Text style={styles.countryCodeText}>{countryFlag} {countryCode}</Text>
        </TouchableOpacity>
        <TextInput
          label="Phone"
          value={formData.personalInfo.phone}
          onChangeText={(text) => setFormData(prev => ({ 
            ...prev, 
            personalInfo: { ...prev.personalInfo, phone: text }
          }))}
          mode="outlined"
          style={styles.phoneInput}
          keyboardType="phone-pad"
          theme={{ roundness: 10 }}
        />
      </View>
      
      <TouchableOpacity onPress={openDatePicker}>
        <View style={styles.dateInputContainer}>
          <TextInput
            label="Date of Birth"
            value={formData.personalInfo.dateOfBirth ? 
              (() => {
                const [year, month] = formData.personalInfo.dateOfBirth.split('-');
                const monthName = months.find(m => m.value === month)?.label || month;
                return `${monthName} ${year}`;
              })() : ''
            }
            mode="outlined"
            style={[styles.input, styles.dateInputField]}
            placeholder="Select month and year"
            theme={{ roundness: 10 }}
            editable={false}
          />
          <TouchableOpacity onPress={openDatePicker} style={styles.gradientIconContainer}>
            <MaskedView
              style={styles.gradientIconWrapper}
              maskElement={
                <View style={styles.gradientIconMask}>
                  <Ionicons name="calendar" size={24} color="black" />
                </View>
              }
            >
              <LinearGradient
                colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientIconFill}
              />
            </MaskedView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <UniversitySearchInput
        label="University"
        placeholder="Search from 30,000+ universities worldwide..."
        value={formData.academicInfo.university}
        onChangeText={(text) => setFormData(prev => ({ 
          ...prev, 
          academicInfo: { ...prev.academicInfo, university: text }
        }))}
        style={styles.input}
        countryFilter={selectedCountry}
      />
      
      <TextInput
        label="Field"
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

  const renderScrollableContent = () => (
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
            onPress={() => {
              setError(''); // Clear any existing errors when going back
              setCurrentStep(currentStep - 1);
            }}
            style={styles.backButton}
          >
            Back
          </Button>
        )}
        
        {currentStep < 5 ? (
          currentStep === 1 ? (
            // Account section - keep filled button style
            isStepComplete() ? (
              <TouchableOpacity
                onPress={() => {
                  console.log('✅ ENABLED Next button clicked!');
                  setClickCount(prev => prev + 1);
                  setError('');
                  setCurrentStep(currentStep + 1);
                }}
                style={[
                  styles.nextButton, 
                  { 
                    backgroundColor: '#6366F1',
                    opacity: 1,
                    padding: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                ]}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                  Next
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  console.log('❌ DISABLED Next button clicked - this should show error!');
                  setClickCount(prev => prev + 1);
                  const errors = getValidationErrors();
                  const errorMessage = errors.length === 1 
                    ? errors[0]
                    : errors.length === 2
                    ? errors.join(' and ')
                    : errors.slice(0, -1).join(', ') + ', and ' + errors[errors.length - 1];
                  setError(errorMessage);
                }}
                style={[
                  styles.nextButton, 
                  { 
                    backgroundColor: '#666666',
                    opacity: 0.5,
                    padding: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                ]}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                  Next
                </Text>
              </TouchableOpacity>
            )
          ) : (
            // Steps 2-4 - use outlined button style like Back button
            <Button
              mode="outlined"
              onPress={() => {
                if (isStepComplete()) {
                  console.log('✅ ENABLED Next button clicked!');
                  setClickCount(prev => prev + 1);
                  setError('');
                  setCurrentStep(currentStep + 1);
                } else {
                  console.log('❌ DISABLED Next button clicked - this should show error!');
                  setClickCount(prev => prev + 1);
                  const errors = getValidationErrors();
                  const errorMessage = errors.length === 1 
                    ? errors[0]
                    : errors.length === 2
                    ? errors.join(' and ')
                    : errors.slice(0, -1).join(', ') + ', and ' + errors[errors.length - 1];
                  setError(errorMessage);
                }
              }}
              style={[
                styles.nextButton,
                {
                  borderColor: isStepComplete() ? '#6366F1' : '#666666',
                  backgroundColor: isStepComplete() ? 'transparent' : '#666666',
                  opacity: 1
                }
              ]}
              textColor="white"
            >
              Next
            </Button>
          )
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
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          data={[1]} // Single item to make FlatList work as a scrollable container
          keyExtractor={() => 'signup-form'}
          renderItem={() => renderScrollableContent()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.flatListContent}
        />
      </KeyboardAvoidingView>

      {/* Country Code Modal */}
      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={countryCodes}
              keyExtractor={(item, index) => `${item.code}-${item.country}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryCodeItem}
                  onPress={() => {
                    setCountryCode(item.code);
                    setCountryFlag(item.flag);
                    setSelectedCountry(item.country);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={styles.countryCodeItemText}>
                    {item.flag} {item.code} ({item.country})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modern Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modernModalOverlay}>
          <View style={styles.modernDatePickerModal}>
            {/* Modern Header with Gradient */}
            <LinearGradient
              colors={['#6366F1', '#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modernModalHeader}
            >
              <View style={styles.modernHeaderContent}>
                <View style={styles.modernHeaderIconContainer}>
                  <Ionicons name="calendar" size={24} color="white" />
                </View>
                <View style={styles.modernHeaderTextContainer}>
                  <Text style={styles.modernModalTitle}>Date of Birth</Text>
                  <Text style={styles.modernModalSubtitle}>Select your birth month and year</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(false)}
                  style={styles.modernCloseButton}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
            
            {/* Modern Picker Content */}
            <View style={styles.modernDatePickerContent}>
              <View style={styles.modernPickerRow}>
                <View style={styles.modernPickerColumn}>
                  <View style={styles.modernPickerHeader}>
                    <Text style={styles.modernPickerLabel}>Month</Text>
                    <View style={styles.modernPickerIndicator} />
                  </View>
                  <ScrollView 
                    style={styles.modernPickerScrollView} 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modernPickerScrollContent}
                  >
                    {months.map((month) => (
                      <TouchableOpacity
                        key={month.value}
                        style={[
                          styles.modernPickerItem,
                          selectedMonth === month.value && styles.modernPickerItemSelected
                        ]}
                        onPress={() => setSelectedMonth(month.value)}
                      >
                        <LinearGradient
                          colors={selectedMonth === month.value ? 
                            ['#6366F1', '#8B5CF6'] : 
                            ['transparent', 'transparent']
                          }
                          style={styles.modernPickerItemGradient}
                        >
                          <Text style={[
                            styles.modernPickerItemText,
                            selectedMonth === month.value && styles.modernPickerItemTextSelected
                          ]}>
                            {month.label}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.modernPickerDivider} />
                
                <View style={styles.modernPickerColumn}>
                  <View style={styles.modernPickerHeader}>
                    <Text style={styles.modernPickerLabel}>Year</Text>
                    <View style={styles.modernPickerIndicator} />
                  </View>
                  <ScrollView 
                    style={styles.modernPickerScrollView} 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modernPickerScrollContent}
                  >
                    {generateYears().map((year) => (
                      <TouchableOpacity
                        key={year.value}
                        style={[
                          styles.modernPickerItem,
                          selectedYear === year.value && styles.modernPickerItemSelected
                        ]}
                        onPress={() => setSelectedYear(year.value)}
                      >
                        <LinearGradient
                          colors={selectedYear === year.value ? 
                            ['#6366F1', '#8B5CF6'] : 
                            ['transparent', 'transparent']
                          }
                          style={styles.modernPickerItemGradient}
                        >
                          <Text style={[
                            styles.modernPickerItemText,
                            selectedYear === year.value && styles.modernPickerItemTextSelected
                          ]}>
                            {year.label}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
            
            {/* Modern Action Buttons */}
            <View style={styles.modernButtonContainer}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.modernCancelButton}
              >
                <Text style={styles.modernCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleDatePickerConfirm}
                disabled={!selectedMonth || !selectedYear}
                style={[
                  styles.modernConfirmButton,
                  (!selectedMonth || !selectedYear) && styles.modernConfirmButtonDisabled
                ]}
              >
                <LinearGradient
                  colors={(!selectedMonth || !selectedYear) ? 
                    ['#666666', '#666666'] : 
                    ['#6366F1', '#8B5CF6', '#EC4899']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modernConfirmButtonGradient}
                >
                  <Text style={styles.modernConfirmButtonText}>
                    {selectedMonth && selectedYear ? 
                      `Confirm ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}` : 
                      'Select Month & Year'
                    }
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
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
    fontSize: 13,
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
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePhotoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6366F1',
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '500',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  editIcon: {
    backgroundColor: '#6366F1',
    margin: 0,
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countryCodeButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    marginTop: 4,
    minWidth: 70,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    height: 44,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    width: '80%',
    maxHeight: '60%',
    borderWidth: 1,
    borderColor: '#333333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    color: '#6366F1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  countryCodeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  countryCodeItemText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  countryCodeInlineButton: {
    paddingHorizontal: 2,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    minWidth: 160,
    zIndex: 999,
  },
  countryCodeInlineText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  datePickerModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    width: '85%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#333333',
  },
  datePickerContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  datePickerColumn: {
    flex: 1,
  },
  datePickerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  datePickerScrollView: {
    maxHeight: 200,
    borderRadius: 8,
    backgroundColor: '#0F0F0F',
  },
  datePickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    alignItems: 'center',
  },
  datePickerItemSelected: {
    backgroundColor: '#6366F1',
  },
  datePickerItemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  datePickerItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  datePickerButtonContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  datePickerCancelButton: {
    flex: 1,
    borderColor: '#6366F1',
  },
  datePickerConfirmButton: {
    flex: 1,
    backgroundColor: '#6366F1',
  },
  datePickerConfirmButtonDisabled: {
    backgroundColor: '#333333',
  },
  dateInputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  dateInputField: {
    paddingRight: 50, // Make room for the gradient icon
    marginBottom: 0,
  },
  gradientIconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }], // Move down to balance the margins
    zIndex: 1,
  },
  gradientIconWrapper: {
    width: 24,
    height: 24,
  },
  gradientIconMask: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  gradientIconFill: {
    width: 24,
    height: 24,
  },
  // Modern Date Picker Styles
  modernModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modernDatePickerModal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    width: '100%',
    maxWidth: 360,
    maxHeight: '60%',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modernModalHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  modernHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modernHeaderIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernHeaderTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  modernModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  modernModalSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '400',
  },
  modernCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernDatePickerContent: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modernPickerRow: {
    flexDirection: 'row',
    gap: 16,
  },
  modernPickerColumn: {
    flex: 1,
  },
  modernPickerHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  modernPickerLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  modernPickerIndicator: {
    width: 30,
    height: 2,
    backgroundColor: '#6366F1',
    borderRadius: 1,
  },
  modernPickerScrollView: {
    maxHeight: 160,
    borderRadius: 12,
    backgroundColor: '#0F0F0F',
  },
  modernPickerScrollContent: {
    paddingVertical: 4,
  },
  modernPickerItem: {
    marginHorizontal: 6,
    marginVertical: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modernPickerItemSelected: {
    elevation: 3,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modernPickerItemGradient: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernPickerItemText: {
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: '500',
  },
  modernPickerItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modernPickerDivider: {
    width: 1,
    backgroundColor: '#333333',
    marginHorizontal: 10,
  },
  modernButtonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    backgroundColor: '#1A1A1A',
  },
  modernCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernCancelButtonText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '600',
  },
  modernConfirmButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modernConfirmButtonDisabled: {
    opacity: 0.5,
  },
  modernConfirmButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});