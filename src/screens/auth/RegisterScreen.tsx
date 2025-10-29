import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  university: string;
  department: string;
  researchArea: string;
  degree: string;
  yearOfStudy: string;
}

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [form, setForm] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    department: '',
    researchArea: '',
    degree: 'PhD',
    yearOfStudy: '',
  });

  const [selectedResearchAreas, setSelectedResearchAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const researchAreas = [
    'Artificial Intelligence', 'Machine Learning', 'Computer Science', 'Biology',
    'Chemistry', 'Physics', 'Mathematics', 'Psychology', 'Medicine',
    'Environmental Science', 'Engineering', 'Economics', 'Sociology', 'History'
  ];

  const updateForm = (field: keyof RegistrationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleResearchArea = (area: string) => {
    setSelectedResearchAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleRegister = async () => {
    setLoading(true);
    
    // Basic validation
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      alert('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Simulate registration API call
    setTimeout(() => {
      setLoading(false);
      alert('Registration successful! Please check your email for verification.');
      navigation.navigate('Login');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="person-add" size={40} color={colors.primary} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the Academic Collaboration Network</Text>
        </View>

        <Card style={styles.formCard}>
          <Card.Content>
            {/* Personal Information */}
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.row}>
              <TextInput
                label="First Name *"
                value={form.firstName}
                onChangeText={(text) => updateForm('firstName', text)}
                style={[styles.input, styles.halfInput]}
                mode="outlined"
              />
              <TextInput
                label="Last Name *"
                value={form.lastName}
                onChangeText={(text) => updateForm('lastName', text)}
                style={[styles.input, styles.halfInput]}
                mode="outlined"
              />
            </View>

            <TextInput
              label="Email Address *"
              value={form.email}
              onChangeText={(text) => updateForm('email', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Password *"
              value={form.password}
              onChangeText={(text) => updateForm('password', text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)} 
                />
              }
            />

            <TextInput
              label="Confirm Password *"
              value={form.confirmPassword}
              onChangeText={(text) => updateForm('confirmPassword', text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon 
                  icon={showConfirmPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                />
              }
            />

            <Divider style={styles.divider} />

            {/* Academic Information */}
            <Text style={styles.sectionTitle}>Academic Information</Text>

            <TextInput
              label="University/Institution *"
              value={form.university}
              onChangeText={(text) => updateForm('university', text)}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Department/Faculty"
              value={form.department}
              onChangeText={(text) => updateForm('department', text)}
              style={styles.input}
              mode="outlined"
            />

            <View style={styles.row}>
              <TextInput
                label="Degree Program"
                value={form.degree}
                onChangeText={(text) => updateForm('degree', text)}
                style={[styles.input, styles.halfInput]}
                mode="outlined"
                placeholder="PhD, Masters, etc."
              />
              <TextInput
                label="Year of Study"
                value={form.yearOfStudy}
                onChangeText={(text) => updateForm('yearOfStudy', text)}
                style={[styles.input, styles.halfInput]}
                mode="outlined"
                placeholder="1st, 2nd, 3rd..."
              />
            </View>

            <Divider style={styles.divider} />

            {/* Research Areas */}
            <Text style={styles.sectionTitle}>Research Areas</Text>
            <Text style={styles.subtitle}>Select your research interests:</Text>

            <View style={styles.chipContainer}>
              {researchAreas.map((area) => (
                <Chip
                  key={area}
                  selected={selectedResearchAreas.includes(area)}
                  onPress={() => toggleResearchArea(area)}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {area}
                </Chip>
              ))}
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
            >
              Already have an account? Sign In
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
    elevation: 4,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  divider: {
    marginVertical: spacing.lg,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    marginBottom: spacing.sm,
  },
  chipText: {
    fontSize: 12,
  },
  registerButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
});