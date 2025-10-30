import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// OAuth2 Provider configurations
export interface OAuth2Provider {
  id: string;
  name: string;
  displayName: string;
  iconName: string;
  clientId: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  scopes: string[];
  additionalParameters?: Record<string, string>;
}

// OAuth2 providers configuration
export const OAUTH_PROVIDERS: Record<string, OAuth2Provider> = {
  google: {
    id: 'google',
    name: 'google',
    displayName: 'Google',
    iconName: 'logo-google',
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with actual client ID
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scopes: ['openid', 'profile', 'email'],
    additionalParameters: {
      access_type: 'offline',
      prompt: 'consent'
    }
  },
  microsoft: {
    id: 'microsoft',
    name: 'microsoft',
    displayName: 'Microsoft',
    iconName: 'logo-microsoft',
    clientId: 'YOUR_MICROSOFT_CLIENT_ID', // Replace with actual client ID
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoEndpoint: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['openid', 'profile', 'email', 'User.Read']
  },
  github: {
    id: 'github',
    name: 'github',
    displayName: 'GitHub',
    iconName: 'logo-github',
    clientId: 'YOUR_GITHUB_CLIENT_ID', // Replace with actual client ID
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userInfoEndpoint: 'https://api.github.com/user',
    scopes: ['user:email', 'read:user']
  },
  orcid: {
    id: 'orcid',
    name: 'orcid',
    displayName: 'ORCID',
    iconName: 'school-outline',
    clientId: 'YOUR_ORCID_CLIENT_ID', // Replace with actual client ID
    authorizationEndpoint: 'https://orcid.org/oauth/authorize',
    tokenEndpoint: 'https://orcid.org/oauth/token',
    userInfoEndpoint: 'https://pub.orcid.org/v3.0',
    scopes: ['/authenticate', '/read-limited']
  }
};

export interface OAuth2User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  raw: any; // Raw user data from provider
}

export interface OAuth2Result {
  success: boolean;
  user?: OAuth2User;
  error?: string;
}

class OAuth2Service {
  private readonly STORAGE_KEYS = {
    ACCESS_TOKEN: 'oauth2_access_token',
    REFRESH_TOKEN: 'oauth2_refresh_token',
    USER_DATA: 'oauth2_user_data',
    PROVIDER: 'oauth2_provider'
  };

  // Generate secure state parameter for OAuth2
  private async generateState(): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString(36),
      { encoding: Crypto.CryptoEncoding.HEX }
    );
  }

  // Get redirect URI for the current platform
  private getRedirectUri(): string {
    if (Platform.OS === 'web') {
      return `${window.location.origin}/auth/callback`;
    }
    return AuthSession.makeRedirectUri({
      scheme: 'phd-collab-app',
      path: 'auth/callback'
    });
  }

  // Authenticate with OAuth2 provider
  async authenticateWithProvider(providerId: string): Promise<OAuth2Result> {
    try {
      const provider = OAUTH_PROVIDERS[providerId];
      if (!provider) {
        return { success: false, error: 'Provider not found' };
      }

      const redirectUri = this.getRedirectUri();
      const state = await this.generateState();

      // Create authorization request
      const request = new AuthSession.AuthRequest({
        clientId: provider.clientId,
        scopes: provider.scopes,
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        state,
        extraParams: provider.additionalParameters || {},
      });

      // Start authorization session
      const result = await request.promptAsync({
        authorizationEndpoint: provider.authorizationEndpoint,
      });

      if (result.type !== 'success') {
        return { 
          success: false, 
          error: result.type === 'cancel' ? 'User cancelled' : 'Authentication failed' 
        };
      }

      // Exchange code for tokens
      const tokenResult = await this.exchangeCodeForTokens(
        provider,
        result.params.code,
        redirectUri
      );

      if (!tokenResult.success) {
        return tokenResult;
      }

      // Get user info
      const userInfo = await this.getUserInfo(provider, tokenResult.accessToken!);
      if (!userInfo.success) {
        return userInfo;
      }

      // Store tokens securely
      await this.storeTokens(
        tokenResult.accessToken!,
        tokenResult.refreshToken,
        provider.id
      );

      return {
        success: true,
        user: userInfo.user
      };

    } catch (error) {
      console.error('OAuth2 authentication error:', error);
      return { 
        success: false, 
        error: 'Authentication failed: ' + (error as Error).message 
      };
    }
  }

  // Exchange authorization code for access tokens
  private async exchangeCodeForTokens(
    provider: OAuth2Provider,
    code: string,
    redirectUri: string
  ): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; error?: string }> {
    try {
      const response = await fetch(provider.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: provider.clientId,
          code,
          redirect_uri: redirectUri,
        }).toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.error_description || data.error || 'Token exchange failed' 
        };
      }

      return {
        success: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };

    } catch (error) {
      return { 
        success: false, 
        error: 'Token exchange failed: ' + (error as Error).message 
      };
    }
  }

  // Get user information from provider
  private async getUserInfo(
    provider: OAuth2Provider,
    accessToken: string
  ): Promise<OAuth2Result> {
    try {
      const response = await fetch(provider.userInfoEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return { success: false, error: 'Failed to get user info' };
      }

      const userData = await response.json();
      const user = this.normalizeUserData(userData, provider, accessToken);

      return { success: true, user };

    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to get user info: ' + (error as Error).message 
      };
    }
  }

  // Normalize user data from different providers
  private normalizeUserData(
    rawData: any,
    provider: OAuth2Provider,
    accessToken: string
  ): OAuth2User {
    let normalized: OAuth2User = {
      id: '',
      email: '',
      name: '',
      provider: provider.id,
      providerId: '',
      accessToken,
      raw: rawData
    };

    switch (provider.id) {
      case 'google':
        normalized.id = rawData.id;
        normalized.providerId = rawData.id;
        normalized.email = rawData.email;
        normalized.name = rawData.name;
        normalized.firstName = rawData.given_name;
        normalized.lastName = rawData.family_name;
        normalized.picture = rawData.picture;
        break;

      case 'microsoft':
        normalized.id = rawData.id;
        normalized.providerId = rawData.id;
        normalized.email = rawData.mail || rawData.userPrincipalName;
        normalized.name = rawData.displayName;
        normalized.firstName = rawData.givenName;
        normalized.lastName = rawData.surname;
        break;

      case 'github':
        normalized.id = rawData.id.toString();
        normalized.providerId = rawData.id.toString();
        normalized.email = rawData.email;
        normalized.name = rawData.name || rawData.login;
        normalized.picture = rawData.avatar_url;
        break;

      case 'orcid':
        normalized.id = rawData.orcid;
        normalized.providerId = rawData.orcid;
        normalized.name = rawData.name;
        // ORCID might not provide email directly
        break;
    }

    return normalized;
  }

  // Store tokens securely
  private async storeTokens(
    accessToken: string,
    refreshToken?: string,
    provider?: string
  ): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync(this.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      if (provider) {
        await SecureStore.setItemAsync(this.STORAGE_KEYS.PROVIDER, provider);
      }
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  // Get stored tokens
  async getStoredTokens(): Promise<{
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
  }> {
    try {
      const [accessToken, refreshToken, provider] = await Promise.all([
        SecureStore.getItemAsync(this.STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(this.STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.getItemAsync(this.STORAGE_KEYS.PROVIDER)
      ]);

      return {
        accessToken: accessToken || undefined,
        refreshToken: refreshToken || undefined,
        provider: provider || undefined
      };
    } catch (error) {
      console.error('Failed to get stored tokens:', error);
      return {};
    }
  }

  // Check if user has valid OAuth2 session
  async hasValidSession(): Promise<boolean> {
    const { accessToken } = await this.getStoredTokens();
    return !!accessToken;
  }

  // Refresh access token
  async refreshAccessToken(): Promise<{ success: boolean; accessToken?: string }> {
    try {
      const { refreshToken, provider } = await this.getStoredTokens();
      
      if (!refreshToken || !provider) {
        return { success: false };
      }

      const providerConfig = OAUTH_PROVIDERS[provider];
      if (!providerConfig) {
        return { success: false };
      }

      const response = await fetch(providerConfig.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: providerConfig.clientId,
        }).toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false };
      }

      // Store new tokens
      await this.storeTokens(data.access_token, data.refresh_token || refreshToken, provider);

      return { success: true, accessToken: data.access_token };

    } catch (error) {
      console.error('Failed to refresh token:', error);
      return { success: false };
    }
  }

  // Sign out and clear tokens
  async signOut(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(this.STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(this.STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(this.STORAGE_KEYS.USER_DATA),
        SecureStore.deleteItemAsync(this.STORAGE_KEYS.PROVIDER)
      ]);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  // Validate university email domain
  isUniversityEmail(email: string): boolean {
    const universityDomains = [
      '.edu',
      '.ac.uk',
      '.edu.au',
      '.ac.ca',
      '.ac.nz',
      '.ac.za',
      '.edu.sg',
      '.ac.jp',
      '.ac.kr',
      '.ac.in',
      '.ac.th',
      '.edu.br',
      '.edu.mx',
      '.edu.co',
      '.edu.ar',
      '.ac.il',
      '.ac.ae',
      '.edu.eg',
      '.ac.ma',
      '.edu.pk',
      '.ac.bd',
      '.edu.my',
      '.ac.lk'
    ];

    return universityDomains.some(domain => email.toLowerCase().endsWith(domain));
  }

  // Extract university from email
  getUniversityFromEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length !== 2) return '';
    
    const domain = parts[1].toLowerCase();
    
    // Remove common subdomains
    const cleanDomain = domain
      .replace(/^(mail\.|webmail\.|student\.|staff\.)/, '')
      .replace(/\.(edu|ac\.uk|edu\.au|ac\.ca)$/, '');
    
    // Convert to readable university name (basic conversion)
    return cleanDomain
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}

export const oauth2Service = new OAuth2Service();
export default oauth2Service;