import TextBox from '@/components/basic/TextBox'
import { darkTheme, lightTheme } from '@/constants/colors'
import React from 'react'
import { View, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeTabScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <TextBox variant='title1'>HomeTabScreen</TextBox>
      </View>
    </SafeAreaView>
  )
}

export default HomeTabScreen