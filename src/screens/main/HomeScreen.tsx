import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../../constants/theme';
import ProfileHeader from '../../components/ProfileHeader';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ProfileHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Active Matches</Text>
            </View>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Ionicons name="diamond" size={12} color={colors.primary} style={styles.dividerIcon} />
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Ionicons name="diamond" size={12} color={colors.primary} style={styles.dividerIcon} />
              <View style={styles.dividerLine} />
            </View>
            <View style={[styles.statItem, styles.connectionsItem]}>
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
    paddingBottom: 120,
    paddingTop: spacing.md,
  },
  statsCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  connectionsItem: {
    flex: 1.3,
  },
  divider: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: spacing.sm,
  },
  dividerLine: {
    height: 1,
    width: 20,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  dividerIcon: {
    marginHorizontal: 4,
    opacity: 0.6,
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
    flexWrap: 'nowrap',
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
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  activityDescription: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    lineHeight: 16,
    opacity: 0.8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 110,
    backgroundColor: colors.primary,
  },
});
