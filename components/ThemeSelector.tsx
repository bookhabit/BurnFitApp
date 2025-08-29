import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
import TextBox from './basic/TextBox';

const ThemeSelector = () => {
    const { t } = useTranslation();
    const { isDarkMode, toggleTheme, theme } = useTheme();
  const handleThemeToggle = () => {
    toggleTheme();
  };
  return (
    <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={handleThemeToggle}>
        <TextBox style={[styles.selectorText, { color: theme.text }]}>
            {t('myPage.theme')}: {isDarkMode ? 'Dark' : 'Light'}
        </TextBox>
    </TouchableOpacity>
  )
}

export default ThemeSelector

const styles = StyleSheet.create({
    selector: {
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      marginVertical: 10,
    },
    selectorText: {
      fontSize: 16,
      textAlign: 'center',
    },
  });