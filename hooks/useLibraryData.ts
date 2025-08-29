import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  muscleGroups: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  exerciseCount: number;
}

export const useLibraryData = () => {
  const { t } = useLanguage();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLibraryData();
  }, [t]); // t 함수가 변경될 때마다 데이터를 다시 로드

  const loadLibraryData = async () => {
    setIsLoading(true);
    try {
      // 실제 앱에서는 API 호출을 여기서 수행
      const mockCategories: Category[] = [
        {
          id: '1',
          name: t('library.categories'),
          icon: '🏋️',
          exerciseCount: 25,
        },
        {
          id: '2',
          name: 'Cardio',
          icon: '❤️',
          exerciseCount: 15,
        },
        {
          id: '3',
          name: 'Yoga',
          icon: '🧘',
          exerciseCount: 20,
        },
        {
          id: '4',
          name: 'Strength',
          icon: '💪',
          exerciseCount: 30,
        },
      ];

      const mockExercises: Exercise[] = [
        {
          id: '1',
          name: 'Push-ups',
          category: 'Strength',
          description: 'Classic upper body exercise',
          difficulty: 'beginner',
          equipment: [],
          muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
        },
        {
          id: '2',
          name: 'Squats',
          category: 'Strength',
          description: 'Lower body compound exercise',
          difficulty: 'beginner',
          equipment: [],
          muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        },
        {
          id: '3',
          name: 'Running',
          category: 'Cardio',
          description: 'Aerobic exercise for cardiovascular health',
          difficulty: 'beginner',
          equipment: ['Running Shoes'],
          muscleGroups: ['Legs', 'Core'],
        },
      ];

      setCategories(mockCategories);
      setExercises(mockExercises);
    } catch (error) {
      console.error('Failed to load library data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getExercisesByCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return exercises.filter(exercise => exercise.category === category?.name);
  };

  return {
    exercises: filteredExercises,
    categories,
    searchQuery,
    selectedCategory,
    isLoading,
    setSearchQuery,
    setSelectedCategory,
    getExercisesByCategory,
    refreshData: loadLibraryData,
  };
};
