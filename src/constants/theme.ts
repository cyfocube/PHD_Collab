import { MD3DarkTheme } from 'react-native-paper';

export const colors = {
  primary: '#64B5F6',
  secondary: '#FFC107',
  accent: '#FFC107',
  background: '#000000',
  surface: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#64B5F6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body1: {
    fontSize: 16,
    color: colors.text,
  },
  body2: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
  },
};

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.accent,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    // Add custom colors that screens expect
    text: colors.text,
    textSecondary: colors.textSecondary,
    accent: colors.accent,
    border: colors.border,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  spacing,
  typography,
};
