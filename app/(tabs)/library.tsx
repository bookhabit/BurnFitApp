import TextBox from '@/components/basic/TextBox'
import { darkTheme, lightTheme } from '@/constants/colors'
import { useLibraryData } from '@/hooks/useLibraryData'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const LibraryTabScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { t } = useTranslation();
  const {
    exercises,
    categories,
    searchQuery,
    selectedCategory,
    isLoading,
    setSearchQuery,
    setSelectedCategory,
  } = useLibraryData();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
        <TextBox variant='title1' style={{ color: theme.text, marginBottom: 20 }}>
          {t('library.title')}
        </TextBox>

        {/* 검색 */}
        <TextInput
          style={{
            backgroundColor: theme.surface,
            color: theme.text,
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 16,
          }}
          placeholder={t('library.search')}
          placeholderTextColor={theme.inactive}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* 카테고리 */}
        <View style={{ marginBottom: 20 }}>
          <TextBox variant='title3' style={{ color: theme.text, marginBottom: 15 }}>
            {t('library.categories')}
          </TextBox>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  {
                    backgroundColor: theme.surface,
                    padding: 15,
                    borderRadius: 10,
                    marginRight: 10,
                    minWidth: 100,
                    alignItems: 'center',
                  },
                  selectedCategory === category.id && { backgroundColor: theme.primary }
                ]}
                onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <TextBox variant='body1' style={{ fontSize: 24, marginBottom: 5 }}>
                  {category.icon}
                </TextBox>
                <TextBox
                  variant='body2'
                  style={{
                    color: selectedCategory === category.id ? theme.background : theme.text,
                    textAlign: 'center',
                  }}
                >
                  {category.name}
                </TextBox>
                <TextBox
                  variant='caption1'
                  style={{
                    color: selectedCategory === category.id ? theme.background : theme.inactive,
                    textAlign: 'center',
                  }}
                >
                  {category.exerciseCount} exercises
                </TextBox>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 운동 목록 */}
        <View>
          <TextBox variant='title3' style={{ color: theme.text, marginBottom: 15 }}>
            {t('library.exercises')}
          </TextBox>
          {exercises.map((exercise) => (
            <View
              key={exercise.id}
              style={{
                backgroundColor: theme.surface,
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <TextBox variant='body1' style={{ color: theme.text, marginBottom: 5 }}>
                {exercise.name}
              </TextBox>
              <TextBox variant='body2' style={{ color: theme.inactive, marginBottom: 5 }}>
                {exercise.description}
              </TextBox>
              <TextBox variant='caption1' style={{ color: theme.inactive }}>
                Difficulty: {exercise.difficulty} | Category: {exercise.category}
              </TextBox>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LibraryTabScreen