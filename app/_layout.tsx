import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import '../lib/i18n';

export default function RootLayout() {
  const [loaded] = useFonts({
    PretendardBold: require('../assets/fonts/Pretendard-Bold.ttf'),
    PretendardExtraBold: require('../assets/fonts/Pretendard-ExtraBold.ttf'),
    PretendardLight: require('../assets/fonts/Pretendard-Light.ttf'),
    PretendardMedium: require('../assets/fonts/Pretendard-Medium.ttf'),
    Pretendard: require('../assets/fonts/Pretendard-Regular.ttf'),
    PretendardSemiBold: require('../assets/fonts/Pretendard-SemiBold.ttf'),
    PretendardThin: require('../assets/fonts/Pretendard-Thin.ttf'),
    BMJUA: require('../assets/fonts/BMJUA.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </LanguageProvider>
  );
}
