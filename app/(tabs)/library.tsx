import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TextBox from '../../components/basic/TextBox';
import { useTheme } from '../../contexts/ThemeContext';
import { useLibraryData } from '../../hooks/useLibraryData';

export default function LibraryTabScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { exercises, categories } = useLibraryData();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView style={{ flex: 1, backgroundColor: theme.background, padding: 20, }} contentContainerStyle={{ gap: 20,paddingBottom:80 }}>
          <TextBox variant='title1' style={{ color: theme.text, }}>
            {t('library.title')}
          </TextBox>

          <View style={{ backgroundColor: theme.surface, padding: 20, borderRadius: 15, marginBottom: 20 }}>
            <TextBox variant='title3' style={{ color: theme.text, marginBottom: 15 }}>
              {t('library.categories')}
            </TextBox>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={{ 
                  backgroundColor: theme.background, 
                  padding: 15, 
                  borderRadius: 10, 
                  marginBottom: 10,
                  alignItems: 'center' 
                }}
              >
                <TextBox variant='button1' style={{ color: theme.primary }}>
                  {category.name}
                </TextBox>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ backgroundColor: theme.surface, padding: 20, borderRadius: 15 }}>
            <TextBox variant='title3' style={{ color: theme.text, marginBottom: 15 }}>
              {t('library.exercises')}
            </TextBox>
            {exercises.map((exercise) => (
              <View key={exercise.id} style={{ marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                <TextBox variant='body1' style={{ color: theme.text, marginBottom: 10 }}>
                  {exercise.name}
                </TextBox>
                <TextBox variant='body2' style={{ color: theme.inactive }}>
                  {exercise.description}
                </TextBox>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}