import TextBox from '@/components/basic/TextBox'
import LanguageSelector from '@/components/LanguageSelector'
import { darkTheme, lightTheme } from '@/constants/colors'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const MyPageTabScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
        <TextBox variant='title1' style={{ color: theme.text, marginBottom: 30, textAlign: 'center' }}>
          {t('myPage.title')}
        </TextBox>

        <View style={{ backgroundColor: theme.surface, padding: 20, borderRadius: 15, marginBottom: 20 }}>
          <TextBox variant='title3' style={{ color: theme.text, marginBottom: 15 }}>
            {t('myPage.settings')}
          </TextBox>
          
          <LanguageSelector />
          
          <View style={{ marginTop: 20 }}>
            <TextBox variant='body1' style={{ color: theme.text, marginBottom: 10 }}>
              {t('myPage.theme')}: {isDarkMode ? 'Dark' : 'Light'}
            </TextBox>
          </View>
        </View>

        <View style={{ backgroundColor: theme.surface, padding: 20, borderRadius: 15 }}>
          <TextBox variant='title3' style={{ color: theme.text, marginBottom: 15 }}>
            {t('myPage.profile')}
          </TextBox>
          <TextBox variant='body1' style={{ color: theme.text, marginBottom: 10 }}>
            User Profile Information
          </TextBox>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MyPageTabScreen