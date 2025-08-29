import TextBox from '@/components/basic/TextBox'
import { useTheme } from '@/contexts/ThemeContext'
import { useHomeData } from '@/hooks/useHomeData'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const HomeTabScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { todayWorkout, recentActivities, isLoading, startWorkout } = useHomeData();

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
          <TextBox variant='body1'>{t('common.loading')}</TextBox>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
          <TextBox variant='title1' style={{ color: theme.text, marginBottom: 20 }}>
            {t('home.welcome')}
          </TextBox>

          {todayWorkout && (
            <View style={{ backgroundColor: theme.surface, padding: 20, borderRadius: 15, marginBottom: 20 }}>
              <TextBox variant='title3' style={{ color: theme.text, marginBottom: 10 }}>
                {todayWorkout.name}
              </TextBox>
              <TextBox variant='body2' style={{ color: theme.text, marginBottom: 5 }}>
                {t('home.duration')}: {todayWorkout.duration} {t('home.minutes')}
              </TextBox>
              <TextBox variant='body2' style={{ color: theme.text, marginBottom: 15 }}>
                {t('home.calories')}: {todayWorkout.calories} kcal
              </TextBox>
              <TouchableOpacity
                style={{ backgroundColor: theme.primary, padding: 15, borderRadius: 10, alignItems: 'center' }}
                onPress={startWorkout}
              >
                <TextBox variant='button1' style={{ color: theme.background }}>
                  {t('home.startWorkout')}
                </TextBox>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ backgroundColor: theme.surface, padding: 20, borderRadius: 15 }}>
            <TextBox variant='title3' style={{ color: theme.text, marginBottom: 15 }}>
              {t('home.recentActivity')}
            </TextBox>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={{ marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                <TextBox variant='body1' style={{ color: theme.text, marginBottom: 10 }}>
                  {activity.title}
                </TextBox>
                <TextBox variant='body2' style={{ color: theme.inactive }}>
                  {activity.description}
                </TextBox>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default HomeTabScreen