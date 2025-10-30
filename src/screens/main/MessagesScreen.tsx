import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, TextInput, Button, Surface, Text, Paragraph, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import ProfileHeader from '../../components/ProfileHeader';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const messages = [
    {
      id: '1',
      sender: 'Dr. Sarah Johnson',
      content: 'Hi! I saw your research on ML applications in healthcare. Would love to collaborate!',
      timestamp: '2 hours ago',
      isUnread: true,
    },
    {
      id: '2',
      sender: 'Prof. Michael Chen',
      content: 'The conference proposal looks great. Let\'s schedule a meeting to discuss next steps.',
      timestamp: '1 day ago',
      isUnread: true,
    },
    {
      id: '3',
      sender: 'Dr. Emily Rodriguez',
      content: 'Thanks for sharing your paper on NLP techniques. Very insightful!',
      timestamp: '3 days ago',
      isUnread: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ProfileHeader />
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Messages</Title>
        <TextInput
          mode="outlined"
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {messages.map((message) => (
          <Card key={message.id} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.senderName}>{message.sender}</Text>
                {message.isUnread && (
                  <Chip style={styles.unreadChip} textStyle={styles.unreadChipText}>
                    New
                  </Chip>
                )}
              </View>
              <Text style={styles.timestamp}>{message.timestamp}</Text>
              <Paragraph style={styles.messagePreview} numberOfLines={2}>
                {message.content}
              </Paragraph>
              <View style={styles.actions}>
                <Button 
                  mode="outlined" 
                  style={styles.actionButton}
                  onPress={() => console.log('Reply to:', message.sender)}
                >
                  Reply
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
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  unreadChip: {
    backgroundColor: theme.colors.primary,
    height: 20,
  },
  unreadChipText: {
    fontSize: 10,
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  messagePreview: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
});