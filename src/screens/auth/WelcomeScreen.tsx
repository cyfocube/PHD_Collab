import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../../constants/theme';

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="school" size={60} color={colors.primary} />
          <Text style={styles.title}>Academic Collaboration Network</Text>
          <Text style={styles.subtitle}>
            Connect with researchers worldwide. Collaborate on groundbreaking research.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={styles.featureContent}>
              <View style={styles.featureHeader}>
                <Ionicons name="people" size={32} color={colors.accent} />
                <Text style={styles.featureTitle}>AI-Powered Matching</Text>
              </View>
              <Text style={styles.featureDescription}>
                Find researchers with complementary skills and shared research interests
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureContent}>
              <View style={styles.featureHeader}>
                <Ionicons name="folder" size={32} color={colors.secondary} />
                <Text style={styles.featureTitle}>Project Collaboration</Text>
              </View>
              <Text style={styles.featureDescription}>
                Shared workspaces for research projects, papers, and data
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureContent}>
              <View style={styles.featureHeader}>
                <Ionicons name="shield-checkmark" size={32} color={colors.info} />
                <Text style={styles.featureTitle}>Academic Verification</Text>
              </View>
              <Text style={styles.featureDescription}>
                Verified researchers through institutional email and ORCID
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  subtitle: {
    ...typography.body1,
    textAlign: 'center',
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
  },
  featuresContainer: {
    paddingVertical: spacing.lg,
  },
  featureCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 12,
    padding: spacing.md,
  },
  featureContent: {
    // Content wrapper
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureTitle: {
    ...typography.h3,
    marginLeft: spacing.md,
    flex: 1,
    color: colors.text,
  },
  featureDescription: {
    ...typography.body2,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  buttonContainer: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryButtonText: {
    ...typography.body1,
    fontWeight: '700' as const,
    color: colors.background,
  },
  secondaryButtonText: {
    ...typography.body1,
    fontWeight: '700' as const,
    color: colors.primary,
  },
});