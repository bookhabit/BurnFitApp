import ThemeSelector from '@/components/ThemeSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TextBox from '../../components/basic/TextBox';
import LanguageSelector from '../../components/LanguageSelector';
import { useTheme } from '../../contexts/ThemeContext';

export default function MyPageTabScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ 
          backgroundColor: theme.background, 
          padding: 20, 
          gap: 20,
          flex: 1 
        }}>
          {/* 제목 */}
          <TextBox variant='title1' style={{ 
            color: theme.text,
          }}>
            {t('myPage.title')}
          </TextBox>

          {/* 설정 섹션 */}
          <View style={{ 
            backgroundColor: theme.surface, 
            padding: 20, 
            borderRadius: 15, 
            gap: 10
          }}>
            <TextBox variant='title3' style={{ 
              color: theme.text,
            }}>
              {t('myPage.settings')}
            </TextBox>
            <LanguageSelector />
            <ThemeSelector />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

