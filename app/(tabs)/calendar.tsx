import Calendar from '@/components/Calendar'
import { darkTheme, lightTheme } from '@/constants/colors'
import React from 'react'
import { View, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const CalendarTabScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Calendar />
      </View>
    </SafeAreaView>
  )
}

export default CalendarTabScreen