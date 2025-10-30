import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        <Text variant="headlineMedium" style={styles.title}>
          Academic Collaboration Network
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Connect with PhD students worldwide
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              disabled={loading}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              autoComplete="password"
              disabled={loading}
            />
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Authenticating...</Text>
              </View>
            ) : (
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
              >
                Login
              </Button>
            )}

            <Text style={styles.orText}>Or continue with</Text>

            <Button
              mode="outlined"
              onPress={() => handleOAuth2Login('google')}
              style={styles.oauthButton}
              disabled={loading}
            >
              University Google
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => handleOAuth2Login('microsoft')}
              style={styles.oauthButton}
              disabled={loading}
            >
              Microsoft 365
            </Button>

            <Button
              mode="outlined"
              onPress={() => handleOAuth2Login('orcid')}
              style={styles.oauthButton}
              disabled={loading}
            >
              ORCID
            </Button>

            <Button
              mode="outlined"
              onPress={() => handleOAuth2Login('github')}
              style={styles.oauthButton}
              disabled={loading}
            >
              GitHub
            </Button>

            <Text style={styles.demoText}>Available Test Accounts</Text>
            <Button
              mode="text"
              onPress={() => {
                setEmail('demo@university.edu');
                setPassword('password123');
              }}
              style={styles.demoButton}
              disabled={loading}
            >
              Sarah Johnson (Stanford)
            </Button>
            <Button
              mode="text"
              onPress={() => {
                setEmail('alex.chen@mit.edu');
                setPassword('secure789');
              }}
              style={styles.demoButton}
              disabled={loading}
            >
              Alex Chen (MIT)
            </Button>
            <Button
              mode="text"
              onPress={() => {
                setEmail('maria.gonzalez@berkeley.edu');
                setPassword('research2024');
              }}
              style={styles.demoButton}
              disabled={loading}
            >
              Maria Gonzalez (UC Berkeley)
            </Button>
          </Card.Content>
        </Card>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  card: {
    padding: 16,
  },
  errorText: {
    color: '#d73a49',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#ffeaea',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
    fontSize: 14,
  },
  oauthButton: {
    marginBottom: 8,
  },
  demoText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  demoButton: {
    alignSelf: 'center',
    marginBottom: 4,
  },
});
