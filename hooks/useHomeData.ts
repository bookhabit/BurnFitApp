import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export interface WorkoutData {
  id: string;
  name: string;
  duration: number;
  calories: number;
  date: string;
}

export interface RecentActivity {
  id: string;
  type: 'workout' | 'goal' | 'achievement';
  title: string;
  description: string;
  date: string;
}

export const useHomeData = () => {
  const { t } = useLanguage();
  const [todayWorkout, setTodayWorkout] = useState<WorkoutData | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, [t]); // t 함수가 변경될 때마다 데이터를 다시 로드

  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      // 실제 앱에서는 API 호출을 여기서 수행
      // 현재는 더미 데이터를 사용
      const mockTodayWorkout: WorkoutData = {
        id: '1',
        name: t('home.todayWorkout'),
        duration: 45,
        calories: 320,
        date: new Date().toISOString(),
      };

      const mockRecentActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'workout',
          title: 'Cardio Session',
          description: 'Completed 30 min cardio workout',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'goal',
          title: 'Weekly Goal Achieved',
          description: 'Completed 5 workouts this week',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'achievement',
          title: 'New Personal Record',
          description: 'Set new record in bench press',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setTodayWorkout(mockTodayWorkout);
      setRecentActivities(mockRecentActivities);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startWorkout = () => {
    // 실제 앱에서는 운동 시작 로직을 여기서 구현
    console.log('Starting workout...');
  };

  return {
    todayWorkout,
    recentActivities,
    isLoading,
    startWorkout,
    refreshData: loadHomeData,
  };
};
