import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Calendar from '../../components/Calendar';
import { useTheme } from '../../contexts/ThemeContext';

export default function CalendarTabScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <Calendar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}