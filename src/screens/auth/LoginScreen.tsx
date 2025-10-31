import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card, ActivityIndicator, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await AuthService.authenticateUser(email, password);
      
      if (result.success && result.user) {
        Alert.alert(
          'Welcome!',
          `Hello ${result.user.personalInfo.firstName} ${result.user.personalInfo.lastName} from ${result.user.academicInfo.university}!`,
          [{ text: 'Continue', onPress: () => login(result.user) }]
        );
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth2Login = async (provider: string) => {
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (provider === 'google') {
        result = await AuthService.authenticateWithGoogle();
      } else if (provider === 'github') {
        result = await AuthService.authenticateWithGitHub();
      } else {
        // For other providers, simulate OAuth2
        await new Promise(resolve => setTimeout(resolve, 1500));
        setError(`${provider} OAuth2 not implemented yet. Please use email/password or demo credentials.`);
        setLoading(false);
        return;
      }

      if (result.success && result.user) {
        Alert.alert(
          'OAuth2 Success!',
          `Welcome ${result.user.personalInfo.firstName} ${result.user.personalInfo.lastName}!`,
          [{ text: 'Continue', onPress: () => login(result.user) }]
        );
      } else {
        setError(result.error || 'OAuth2 authentication failed');
      }
    } catch (error) {
      setError('OAuth2 authentication failed. Please try again.');
      console.error(`${provider} OAuth2 error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Welcome to ProHub
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          
          <TextInput
            label="Email or username"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            disabled={loading}
            contentStyle={{ paddingVertical: 8 }}
            theme={{ 
              colors: { 
                outline: '#333333',
                onSurfaceVariant: '#A1A1AA',
                primary: '#6366F1'
              },
              roundness: 10
            }}
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            autoComplete="password"
            disabled={loading}
            contentStyle={{ paddingVertical: 8 }}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            theme={{ 
              colors: { 
                outline: '#333333',
                onSurfaceVariant: '#A1A1AA',
                primary: '#6366F1'
              },
              roundness: 10
            }}
          />
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Text style={styles.loadingText}>Signing in...</Text>
            </View>
          ) : (
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Sign In
            </Button>
          )}

          {/* Forgot Password & Username Links */}
          <View style={styles.forgotLinksContainer}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
            <Text style={styles.forgotSeparator}>  |  </Text>
            <Text style={styles.forgotPassword}>Forgot username?</Text>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text 
                style={styles.signUpLink}
                onPress={() => navigation.navigate('SignUp')}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>

        {/* Footer with Support */}
        <View style={styles.footer}>
          <View style={styles.supportContainer}>
            <Text style={styles.supportText}>📞 Support</Text>
            <Text style={styles.supportSeparator}>  |  </Text>
            <Text style={styles.supportText}>👥 Customer Service</Text>
          </View>
          <Text style={styles.logoText}>💼 ProHub</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A1A1AA',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 0,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -40,
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
    marginBottom: 12,
    backgroundColor: '#1A1A1A',
    height: 43,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#6366F1',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    color: '#A1A1AA',
    fontSize: 14,
  },
  forgotLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPassword: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
  },
  forgotSeparator: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  signUpLink: {
    color: '#6366F1',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  supportContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportText: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  supportSeparator: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  logoText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
