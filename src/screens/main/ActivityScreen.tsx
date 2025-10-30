import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, Avatar, Surface, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import ProfileHeader from '../../components/ProfileHeader';

export default function ActivityScreen() {
  const activities = [
    {
      id: '1',
      type: 'match',
      title: 'New Match Found',
      description: 'You matched with Dr. Emily Zhang from MIT',
      time: '2 hours ago',
      avatar: 'EZ',
      color: '#4CAF50',
      icon: 'people-outline'
    },
    {
      id: '2',
      type: 'project',
      title: 'Project Update',
      description: 'AI-Powered Climate Analysis reached 75% completion',
      time: '4 hours ago',
      avatar: 'AI',
      color: '#2196F3',
      icon: 'trending-up-outline'
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      description: 'Dr. Sarah Johnson replied to your collaboration request',
      time: '6 hours ago',
      avatar: 'SJ',
      color: '#FF9800',
      icon: 'chatbubble-outline'
    },
    {
      id: '4',
      type: 'publication',
      title: 'Publication Milestone',
      description: 'Your paper "Neural Network Optimization" was cited 10 times',
      time: '1 day ago',
      avatar: 'NN',
      color: '#9C27B0',
      icon: 'document-text-outline'
    },
    {
      id: '5',
      type: 'conference',
      title: 'Conference Invitation',
      description: 'You were invited to speak at ICML 2025',
      time: '2 days ago',
      avatar: 'IC',
      color: '#F44336',
      icon: 'school-outline'
    },
    {
      id: '6',
      type: 'collaboration',
      title: 'Collaboration Request',
      description: 'Dr. Michael Chen wants to collaborate on biomedical research',
      time: '3 days ago',
      avatar: 'MC',
      color: '#00BCD4',
      icon: 'people-outline'
    },
    {
      id: '7',
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'You completed your first international collaboration!',
      time: '1 week ago',
      avatar: '🏆',
      color: '#FFD700',
      icon: 'trophy-outline'
    }
  ];

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'match': return '#4CAF50';
      case 'project': return '#2196F3';
      case 'message': return '#FF9800';
      case 'publication': return '#9C27B0';
      case 'conference': return '#F44336';
      case 'collaboration': return '#00BCD4';
      case 'achievement': return '#FFD700';
      default: return theme.colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ProfileHeader />
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Recent Activity</Title>
        <View style={styles.filterContainer}>
          <Chip mode="outlined" style={styles.chip} textStyle={styles.chipText}>All</Chip>
          <Chip mode="outlined" style={styles.chip} textStyle={styles.chipText}>Projects</Chip>
          <Chip mode="outlined" style={styles.chip} textStyle={styles.chipText}>Messages</Chip>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {activities.map((activity) => (
          <Card key={activity.id} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.activityHeader}>
                <Avatar.Text 
                  size={45} 
                  label={activity.avatar}
                  style={{ backgroundColor: getActivityTypeColor(activity.type) }}
                />
                <View style={styles.activityInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Ionicons 
                      name={activity.icon as keyof typeof Ionicons.glyphMap} 
                      size={16} 
                      color={getActivityTypeColor(activity.type)} 
                    />
                  </View>
                  <Text style={styles.description}>{activity.description}</Text>
                  <Text style={styles.time}>{activity.time}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: theme.colors.background,
  },
  chipText: {
    fontSize: 12,
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 1,
  },
  cardContent: {
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityInfo: {
    marginLeft: 16,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});