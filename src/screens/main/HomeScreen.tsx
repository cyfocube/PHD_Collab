import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../../constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, Dr. Smith!</Text>
          <Text style={styles.subtitle}>Ready to collaborate today?</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Your Research Network</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Active Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>28</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="person-add" size={24} color={colors.accent} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Match Found!</Text>
              <Text style={styles.activityDescription}>
                Dr. Elena Petrov from ETH Zurich - Quantum Computing
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="document-text" size={24} color={colors.info} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Project Update</Text>
              <Text style={styles.activityDescription}>
                "AI in Healthcare" project milestone completed
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="calendar" size={24} color={colors.warning} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Upcoming Event</Text>
              <Text style={styles.activityDescription}>
                International ML Conference - 3 days remaining
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {}}
        color={colors.background}
      />
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
    paddingBottom: 100,
  },
  header: {
    paddingVertical: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    borderRadius: 12,
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  activityCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    borderRadius: 12,
    padding: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  activityTitle: {
    ...typography.body1,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  activityDescription: {
    ...typography.body2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: colors.primary,
  },
});