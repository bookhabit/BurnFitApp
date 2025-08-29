import { darkTheme, lightTheme } from '@/constants/colors';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';


import { useTheme } from '@/contexts/ThemeContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? darkTheme.primary : lightTheme.primary,
        tabBarInactiveTintColor: isDarkMode ? darkTheme.inactive : lightTheme.inactive,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 90,
            paddingBottom: 20,
            paddingTop: 10,
            backgroundColor: isDarkMode ? darkTheme.background : lightTheme.background,
            borderTopColor: isDarkMode ? darkTheme.border : lightTheme.border,
          },
          default: {
            height: 90,
            paddingBottom: 20,
            paddingTop: 10,
            backgroundColor: isDarkMode ? darkTheme.background : lightTheme.background,
            borderTopColor: isDarkMode ? darkTheme.border : lightTheme.border,
          },
        }),
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('tabs.calendar'),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('tabs.library'),
          tabBarIcon: ({ color, size }) => (
            <Entypo name="book" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-page"
        options={{
          title: t('tabs.myPage'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
