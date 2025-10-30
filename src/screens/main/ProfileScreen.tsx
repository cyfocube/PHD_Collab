import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Avatar, Button, Surface, Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import ProfileHeader from '../../components/ProfileHeader';

export default function ProfileScreen() {
  const { currentUser, logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              console.log('User logged out successfully');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <ProfileHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <ProfileHeader />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load profile</Text>
          <Text style={styles.errorText}>Please try logging in again</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userInitials = `${currentUser.personalInfo.firstName[0]}${currentUser.personalInfo.lastName[0]}`;
  const fullName = `${currentUser.personalInfo.firstName} ${currentUser.personalInfo.lastName}`;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ProfileHeader />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Surface style={styles.profileHeader}>
          <Avatar.Text size={80} label={userInitials} style={{ backgroundColor: theme.colors.primary }} />
          <Title style={styles.name}>{fullName}</Title>
          <Paragraph style={styles.subtitle}>{currentUser.academicInfo.degreeLevel} in {currentUser.academicInfo.department}</Paragraph>
          <Paragraph style={styles.university}>{currentUser.academicInfo.university}</Paragraph>
          <View style={styles.verificationBadge}>
            <Ionicons 
              name={currentUser.accountSettings.isVerified ? "checkmark-circle" : "alert-circle"} 
              size={16} 
              color={currentUser.accountSettings.isVerified ? "#4CAF50" : "#FF9800"} 
            />
            <Text style={[styles.verificationText, { color: currentUser.accountSettings.isVerified ? "#4CAF50" : "#FF9800" }]}>
              {currentUser.accountSettings.isVerified ? "Verified Account" : "Unverified Account"}
            </Text>
          </View>
        </Surface>

        {/* Research Interests */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Research Areas</Title>
            <View style={styles.tagsContainer}>
              {currentUser.academicInfo.researchAreas.map((area, index) => (
                <Surface key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{area}</Text>
                </Surface>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Academic Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Academic Profile</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statNumber}>{currentUser.academicInfo.publications}</Text>
                <Text style={styles.statLabel}>Publications</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statNumber}>{currentUser.academicInfo.conferences}</Text>
                <Text style={styles.statLabel}>Conferences</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="school-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statNumber}>{currentUser.academicInfo.currentGPA}</Text>
                <Text style={styles.statLabel}>GPA</Text>
              </View>
            </View>
            <View style={styles.academicDetails}>
              <Text style={styles.detailItem}>
                <Ionicons name="person-outline" size={16} color={theme.colors.textSecondary} />
                {' '}Advisor: {currentUser.academicInfo.advisor}
              </Text>
              <Text style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                {' '}Year {currentUser.academicInfo.yearOfStudy} - Expected graduation: {currentUser.academicInfo.expectedGraduation}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Profile Actions</Title>
            <Button
              mode="outlined"
              icon="pencil"
              style={styles.actionButton}
              onPress={() => console.log('Edit profile')}
            >
              Edit Profile
            </Button>
            <Button
              mode="outlined"
              icon="cog"
              style={styles.actionButton}
              onPress={() => console.log('Settings')}
            >
              Settings
            </Button>
            <Button
              mode="outlined"
              icon="logout"
              style={[styles.actionButton, styles.logoutButton]}
              textColor="#F44336"
              onPress={handleLogout}
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Add padding to account for tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  profileHeader: {
    padding: 24,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  name: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.primary,
    marginTop: 4,
  },
  university: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  verificationText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
  tagText: {
    fontSize: 12,
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  academicDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  detailItem: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 8,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});