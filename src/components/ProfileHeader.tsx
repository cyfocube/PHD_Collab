import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Surface, Avatar, Text, IconButton, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileHeader({ onSearch }: { onSearch?: (query: string) => void }) {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
      if (onSearch) {
        onSearch('');
      }
    }
  };

  const userInitials = `${currentUser.personalInfo.firstName[0]}${currentUser.personalInfo.lastName[0]}`;
  const fullName = `${currentUser.personalInfo.firstName} ${currentUser.personalInfo.lastName}`;

  const handleProfilePress = () => {
    // Navigate to Profile tab
    navigation.navigate('Profile' as never);
  };

  return (
    <View>
      <Surface style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.leftSection}>
          {isSearchVisible && (
            <TextInput
              mode="outlined"
              placeholder="Search..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              style={[
                styles.searchBox,
                isSearchVisible && styles.searchBoxExpanded
              ]}
              left={<TextInput.Icon icon="magnify" size={18} />}
              dense
              contentStyle={styles.searchContent}
              outlineStyle={[
                styles.searchOutline,
                isSearchVisible && styles.searchOutlineExpanded
              ]}
              autoFocus={isSearchVisible}
            />
          )}
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.searchIcon} onPress={toggleSearch}>
            <Ionicons 
              name={isSearchVisible ? "close" : "search"} 
              size={20} 
              color={theme.colors.onSurface} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.profileSection} onPress={handleProfilePress}>
            <Avatar.Text 
              size={32} 
              label={userInitials} 
              style={{ backgroundColor: theme.colors.primary }}
            />
          </TouchableOpacity>
        </View>
      </Surface>
      <View style={styles.dividerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    marginBottom: 0,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBox: {
    width: 160,
    height: 36,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
  },
  searchBoxExpanded: {
    width: 320,
    borderRadius: 10,
  },
  searchContent: {
    fontSize: 13,
    paddingLeft: 8,
  },
  searchOutline: {
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: theme.colors.outline,
    opacity: 0.3,
  },
  searchOutlineExpanded: {
    borderRadius: 10,
    borderWidth: 1,
    opacity: 0.5,
  },
  searchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
  },
  dividerLine: {
    height: 1,
    backgroundColor: theme.colors.outline,
    opacity: 0.2,
    marginHorizontal: 16,
    marginBottom: 8,
  },
});