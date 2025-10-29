import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Divider, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { colors, spacing, typography } from '../../constants/theme';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { RootState } from '../../store';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  // Debug: Monitor authentication state
  useEffect(() => {
    console.log('Authentication state changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('User is now authenticated, should navigate to main app');
    }
  }, [isAuthenticated]);

  const updateForm = (field: keyof LoginForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    // Email validation
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    dispatch(loginStart());
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication logic
      if (form.email === 'demo@university.edu' && form.password === 'password123') {
        // Successful login - dispatch Redux action
        console.log('Dispatching loginSuccess action');
        dispatch(loginSuccess({
          token: 'mock_jwt_token_12345',
          refreshToken: 'mock_refresh_token_67890'
        }));

        console.log('Login success action dispatched');
        
        // Small delay to ensure Redux state is updated, then navigation should happen automatically
        setTimeout(() => {
          if (isAuthenticated) {
            console.log('Navigation should now happen automatically via AppNavigator');
          }
        }, 100);
        
        Alert.alert(
          'Login Successful!',
          'Welcome to the Academic Collaboration Network'
        );
      } else {
        // Invalid credentials
        dispatch(loginFailure('Invalid email or password'));
        Alert.alert(
          'Login Failed',
          'Invalid email or password. Please try again.\n\nDemo credentials:\nEmail: demo@university.edu\nPassword: password123'
        );
      }
    } catch (error) {
      dispatch(loginFailure('An error occurred during login'));
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality would be implemented here. For demo purposes, use:\nEmail: demo@university.edu\nPassword: password123'
    );
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      'Google Login',
      'Google OAuth integration would be implemented here.'
    );
  };

  const handleAppleLogin = () => {
    Alert.alert(
      'Apple Login',
      'Apple Sign-In integration would be implemented here.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Ionicons name="school" size={50} color={colors.primary} />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your Academic Collaboration Network account</Text>
          </View>

          <Card style={styles.formCard}>
            <Card.Content>
              <TextInput
                label="Email Address"
                value={form.email}
                onChangeText={(text) => updateForm('email', text)}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!errors.email}
                left={<TextInput.Icon icon="email" />}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                label="Password"
                value={form.password}
                onChangeText={(text) => updateForm('password', text)}
                style={styles.input}
                mode="outlined"
                secureTextEntry={!showPassword}
                error={!!errors.password}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)} 
                  />
                }
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <View style={styles.optionsRow}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() => setRememberMe(!rememberMe)}
                  />
                  <Text style={styles.checkboxLabel}>Remember me</Text>
                </View>
                
                <Button
                  mode="text"
                  onPress={handleForgotPassword}
                  compact
                  style={styles.forgotButton}
                >
                  Forgot Password?
                </Button>
              </View>

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider style={styles.divider} />

              <Text style={styles.orText}>Or continue with</Text>

              <View style={styles.socialButtonsContainer}>
                <Button
                  mode="outlined"
                  onPress={handleGoogleLogin}
                  style={[styles.socialButton, styles.googleButton]}
                  contentStyle={styles.socialButtonContent}
                  icon="google"
                >
                  Google
                </Button>

                <Button
                  mode="outlined"
                  onPress={handleAppleLogin}
                  style={[styles.socialButton, styles.appleButton]}
                  contentStyle={styles.socialButtonContent}
                  icon="apple"
                >
                  Apple
                </Button>
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Register')}
                  compact
                  style={styles.signupButton}
                >
                  Sign Up
                </Button>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Email: demo@university.edu</Text>
            <Text style={styles.demoText}>Password: password123</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
    paddingHorizontal: spacing.md,
  },
  formCard: {
    backgroundColor: colors.surface,
    elevation: 4,
    marginTop: spacing.lg,
  },
  input: {
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    ...typography.body2,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  forgotButton: {
    marginRight: -spacing.sm,
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  divider: {
    marginVertical: spacing.lg,
  },
  orText: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  socialButton: {
    flex: 1,
  },
  socialButtonContent: {
    paddingVertical: spacing.sm,
  },
  googleButton: {
    borderColor: '#DB4437',
  },
  appleButton: {
    borderColor: '#000000',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signupText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  signupButton: {
    marginLeft: -spacing.sm,
  },
  demoInfo: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  demoTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  demoText: {
    ...typography.body2,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});