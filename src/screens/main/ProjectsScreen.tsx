import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, TextInput, Button, Surface, Text, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import ProfileHeader from '../../components/ProfileHeader';

export default function ProjectsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: '1',
      title: 'AI-Powered Climate Analysis',
      description: 'Using machine learning to predict climate patterns',
      status: 'Active',
      collaborators: 3,
      progress: 75,
      field: 'Environmental Science',
    },
    {
      id: '2',
      title: 'Neural Network Optimization',
      description: 'Improving deep learning model efficiency',
      status: 'Planning',
      collaborators: 2,
      progress: 25,
      field: 'Computer Science',
    },
    {
      id: '3',
      title: 'Biomedical Data Mining',
      description: 'Extracting insights from medical research data',
      status: 'Completed',
      collaborators: 4,
      progress: 100,
      field: 'Medicine',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ProfileHeader />
      <View style={styles.header}>
        <Title style={styles.headerTitle}>My Projects</Title>
        <TextInput
          mode="outlined"
          placeholder="Search projects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {projects
          .filter(project => 
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((project) => (
          <Card key={project.id} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.projectHeader}>
                <Avatar.Text 
                  size={50} 
                  label={project.title.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <View style={styles.projectInfo}>
                  <Title style={styles.projectTitle}>{project.title}</Title>
                  <Text style={styles.field}>{project.field}</Text>
                  <Text style={styles.description}>{project.description}</Text>
                </View>
              </View>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Ionicons name="people" size={16} color={theme.colors.primary} />
                  <Text style={styles.statText}>{project.collaborators} collaborators</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="trending-up" size={16} color={theme.colors.primary} />
                  <Text style={styles.statText}>{project.progress}% complete</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons 
                    name={project.status === 'Active' ? 'play-circle' : project.status === 'Completed' ? 'checkmark-circle' : 'pause-circle'} 
                    size={16} 
                    color={project.status === 'Active' ? '#4CAF50' : project.status === 'Completed' ? '#2196F3' : '#FF9800'} 
                  />
                  <Text style={styles.statText}>{project.status}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Button 
                  mode="outlined" 
                  style={styles.actionButton}
                  onPress={() => console.log('View project:', project.title)}
                >
                  View Details
                </Button>
                <Button 
                  mode="contained" 
                  style={styles.actionButton}
                  onPress={() => console.log('Edit project:', project.title)}
                >
                  Edit Project
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
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectInfo: {
    marginLeft: 16,
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  field: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  stats: {
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
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