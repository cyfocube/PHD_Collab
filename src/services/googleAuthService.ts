import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

// Complete the auth session for web browsers
WebBrowser.maybeCompleteAuthSession();

// Google OAuth2 configuration - this should work with Expo
const GOOGLE_CLIENT_ID = '589872062005-8qacnfg5u6uacqhiijlvrbf4a3bsfroo.apps.googleusercontent.com';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  verified_email: boolean;
}

interface GoogleAuthResult {
  success: boolean;
  user?: GoogleUser;
  error?: string;
  accessToken?: string;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;

  private constructor() {}

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  // Real Google OAuth2 authentication that opens on your device
  public async authenticateWithGoogle(): Promise<GoogleAuthResult> {
    try {
      console.log('Starting REAL Google OAuth2 authentication...');

      // Use the discovery document for Google OAuth2
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      // Create the auth request
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({
          native: 'com.cyfocube.phdcollab://redirect',
        }),
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          prompt: 'select_account', // This forces Google to show account picker
        },
      });

      console.log('Opening Google account selection on your device...');

      // This will open Google's real account picker on your phone/browser
      const result = await request.promptAsync(discovery);

      console.log('Google auth result:', result);

      if (result.type === 'success') {
        console.log('Google authentication successful!');
        
        // Exchange the authorization code for tokens
        if (!result.params.code) {
          return {
            success: false,
            error: 'No authorization code received from Google',
          };
        }

        const tokenResult = await this.exchangeCodeForTokens(
          result.params.code, 
          request.redirectUri
        );
        
        if (!tokenResult.success) {
          return {
            success: false,
            error: tokenResult.error || 'Failed to exchange code for tokens',
          };
        }

        // Get the actual user profile from Google
        const userInfo = await this.getUserProfile(tokenResult.accessToken!);
        
        if (!userInfo.success) {
          return {
            success: false,
            error: userInfo.error || 'Failed to get user profile',
          };
        }

        // Store the real access token
        await SecureStore.setItemAsync('googleAccessToken', tokenResult.accessToken!);
        
        console.log(`Google authentication successful for ${userInfo.user!.name} (${userInfo.user!.email})`);

        return {
          success: true,
          user: userInfo.user,
          accessToken: tokenResult.accessToken,
        };

      } else if (result.type === 'cancel') {
        console.log('User cancelled Google sign-in');
        return {
          success: false,
          error: 'Google sign-in was cancelled',
        };
      } else {
        console.log('Google sign-in failed:', result.type);
        return {
          success: false,
          error: `Google sign-in failed: ${result.type}`,
        };
      }

    } catch (error) {
      console.error('Google OAuth2 error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google authentication failed',
      };
    }
  }





  // Exchange authorization code for access token
  private async exchangeCodeForTokens(code: string, redirectUri: string): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    try {
      console.log('Exchanging code for tokens...');
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      const data = await response.json();
      console.log('Token response:', data);

      if (!response.ok) {
        return {
          success: false,
          error: data.error_description || 'Failed to exchange code for tokens',
        };
      }

      return {
        success: true,
        accessToken: data.access_token,
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token exchange failed',
      };
    }
  }

  // Get user profile from Google
  private async getUserProfile(accessToken: string): Promise<{ success: boolean; user?: GoogleUser; error?: string }> {
    try {
      console.log('Getting user profile...');
      
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await response.json();
      console.log('User profile:', userData);

      if (!response.ok) {
        return {
          success: false,
          error: userData.error?.message || 'Failed to get user profile',
        };
      }

      return {
        success: true,
        user: userData as GoogleUser,
      };
    } catch (error) {
      console.error('User profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user profile',
      };
    }
  }

  // Sign out from Google
  public async signOut(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('googleAccessToken');
      console.log('Google sign out successful');
    } catch (error) {
      console.error('Google sign out error:', error);
    }
  }

  // Get stored access token
  public async getStoredAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('googleAccessToken');
    } catch (error) {
      console.error('Error getting stored access token:', error);
      return null;
    }
  }
}

export default GoogleAuthService.getInstance();