import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/main/HomeScreen';
import MatchingScreen from '../screens/main/MatchingScreen';
import ProjectsScreen from '../screens/main/ProjectsScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import ActivityScreen from '../screens/main/ActivityScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
        screenOptions={({ route }: { route: any }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 90,
            paddingBottom: 25,
            paddingTop: 5,
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '300',
            marginTop: -20,
          },
          tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Matching') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Projects') {
              iconName = focused ? 'folder' : 'folder-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Activity') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-outline';
            }

            return (
              <Ionicons 
                name={iconName} 
                size={24} 
                color={color} 
                style={{ marginTop: -3 }}
              />
            );
          },
        })}
      >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Matching" component={MatchingScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Chat" component={MessagesScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}