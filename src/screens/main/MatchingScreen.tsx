import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, TextInput, Button, Surface, Text, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import ProfileHeader from '../../components/ProfileHeader';

export default function MatchingScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      field: 'Machine Learning',
      university: 'MIT',
      publications: 23,
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      field: 'Computer Vision',
      university: 'Stanford',
      publications: 45,
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      field: 'Natural Language Processing',
      university: 'Berkeley',
      publications: 31,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ProfileHeader />
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Research Matches</Title>
        <TextInput
          mode="outlined"
          placeholder="Search matches by name, field, or university..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {searchResults.map((researcher) => (
          <Card key={researcher.id} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.researcherHeader}>
                <Avatar.Text 
                  size={50} 
                  label={researcher.name.split(' ').map(n => n[0]).join('')}
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <View style={styles.researcherInfo}>
                  <Title style={styles.researcherName}>{researcher.name}</Title>
                  <Text style={styles.field}>{researcher.field}</Text>
                  <Text style={styles.university}>{researcher.university}</Text>
                </View>
              </View>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Ionicons name="document-text" size={16} color={theme.colors.primary} />
                  <Text style={styles.statText}>{researcher.publications} publications</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Button 
                  mode="outlined" 
                  style={styles.actionButton}
                  onPress={() => console.log('View profile:', researcher.name)}
                >
                  View Profile
                </Button>
                <Button 
                  mode="contained" 
                  style={styles.actionButton}
                  onPress={() => console.log('Connect with:', researcher.name)}
                >
                  Connect
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  searchInput: {
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  researcherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  researcherInfo: {
    marginLeft: 16,
    flex: 1,
  },
  researcherName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  field: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 2,
  },
  university: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  stats: {
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});