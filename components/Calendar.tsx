import { useTheme } from '@/contexts/ThemeContext';
import Entypo from '@expo/vector-icons/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarDay } from '../lib/calendarUtils';
import TextBox from './basic/TextBox';

const SWIPE_THRESHOLD = 80;

const Calendar: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const {
    calendarData,
    currentView,
    currentWeekNumber,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousWeek,
    goToNextWeek,
    selectDate,
    goToToday,
    changeView,
    goToDate,
  } = useCalendar();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState(new Date());

  // X/Y 위치값 (스와이프)
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleDatePress = (day: CalendarDay) => {
    selectDate(day.date);
  };

  const handleHeaderPress = () => {
    setTempDate(
      new Date(calendarData.monthView.year, calendarData.monthView.month, 1),
    );
    setPickerMode('date');
    setShowDatePicker(true);
  };

  const handleDatePickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
      // 날짜가 선택되면 자동으로 모달을 닫고 캘린더를 이동
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      goToDate(year, month, 1);
      setShowDatePicker(false);
    }
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  /** 가로 스와이프 제스처 */
  const panX = Gesture.Pan()
    .onUpdate(e => {
      // 드래그 중에는 캘린더를 움직이지 않고 시각적 피드백만 제공
      if (Math.abs(e.translationX) > 20) {
        // 드래그가 임계값을 넘으면 방향 힌트 표시 (선택사항)
        // 여기서는 캘린더를 움직이지 않음
      }
    })
    .onEnd(e => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(currentView === 'month' ? goToNextMonth : goToNextWeek)();
      } else if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(currentView === 'month' ? goToPreviousMonth : goToPreviousWeek)();
      }
      // 제스처 완료 후 위치 초기화
      translateX.value = withSpring(0);
    });

  /** 세로 스와이프 제스처 (월 <-> 주 뷰 전환) */
  const panY = Gesture.Pan()
    .onUpdate(e => {
      // 드래그 중에는 캘린더를 움직이지 않고 시각적 피드백만 제공
      if (Math.abs(e.translationY) > 20) {
        // 드래그가 임계값을 넘으면 방향 힌트 표시 (선택사항)
        // 여기서는 캘린더를 움직이지 않음
      }
    })
    .onEnd(e => {
      if (e.translationY < -SWIPE_THRESHOLD && currentView === 'month') {
        runOnJS(changeView)('week');
      } else if (e.translationY > SWIPE_THRESHOLD && currentView === 'week') {
        runOnJS(changeView)('month');
      }
      // 제스처 완료 후 위치 초기화
      translateY.value = withSpring(0);
    });

  const composed = Gesture.Simultaneous(panX, panY);

  /** 애니메이션 스타일 */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const renderDatePickerModal = () => (
    <Modal
      visible={showDatePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={handleDatePickerCancel}>
      <View style={styles.modalOverlay}>
        <DateTimePicker
          value={tempDate}
          mode={pickerMode}
          display="spinner"
          onChange={handleDatePickerChange}
        />
      </View>
    </Modal>
  );

  const renderMonthView = () => {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={goToPreviousMonth}
            style={[styles.navButton]}>
            <Entypo name="chevron-left" size={24} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleHeaderPress}
            style={styles.headerTitleContainer}>
            <TextBox variant="title3" style={{ color: theme.text }}>
              {calendarData.monthView.year} {t('calendar.year')}{' '}
              {t(`calendar.months.${calendarData.monthView.month}`)}
            </TextBox>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToNextMonth} style={[styles.navButton]}>
              <Entypo name="chevron-right" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

      {/* 요일 헤더 */}
      <View style={styles.weekHeader}>
        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
          <View key={dayIndex} style={styles.dayHeader}>
            <TextBox  
              variant="body4"
              style={[
                dayIndex === 0 && styles.sundayText,
              ]}>
              {t(`calendar.days.${dayIndex}`)}
            </TextBox>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 */}
      {calendarData.monthView.weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.days.map((day, dayIndex) => (
            <TouchableOpacity
              key={dayIndex}
              style={[
                styles.day,
                !day.isCurrentMonth && styles.otherMonthDay,
                day.isToday && [styles.today, { borderColor: theme.primary, borderRadius: 50 }],
                day.isSelected && [styles.selectedDay, { borderColor: theme.primary, borderRadius: 50 }],
              ]}
              onPress={() => handleDatePress(day)}>
              <TextBox
                variant="body2"
                style={[
                  { color: theme.text },
                  !day.isCurrentMonth && styles.otherMonthDayText,
                  day.isToday && styles.todayText,
                  day.isSelected && [styles.selectedDayText, ],
                  day.dayOfWeek === 0 && styles.sundayText,
                ]}>
                {day.day}
              </TextBox>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* 드래그 영역 - 마지막 row 밑에 border */}
      <View style={[styles.dragArea, ]}>
        <View style={[styles.dragIndicator, { backgroundColor: theme.border }]} />
      </View>

      {/* DatePicker 모달 */}
      {renderDatePickerModal()}
    </View>
  );
};

const renderWeekView = () => {
  const currentWeek = calendarData.weekView.find(
    week => week.weekNumber === currentWeekNumber,
  );

  if (!currentWeek) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousWeek} style={[styles.navButton]}>
          <Entypo name="chevron-left" size={24} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleHeaderPress}
          style={styles.headerTitleContainer}>
          <TextBox variant="title3" style={{ color: theme.text }}>
            {calendarData.monthView.year} {t('calendar.year')}{' '}
            {t(`calendar.months.${calendarData.monthView.month}`)}
          </TextBox>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
          <Entypo name="chevron-right" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekHeader}>
        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
          <View key={dayIndex} style={styles.dayHeader}>
            <TextBox
              variant="body4"
              style={[
                dayIndex === 0 && styles.sundayText,
              ]}>
              {t(`calendar.days.${dayIndex}`)}
            </TextBox>
          </View>
        ))}
      </View>

      {/* 주 날짜 */}
      <View style={styles.week}>
        {currentWeek.days.map((day, dayIndex) => (
          <TouchableOpacity
            key={dayIndex}
            style={[
              styles.day,
              !day.isCurrentMonth && styles.otherMonthDay,
              day.isToday && [styles.today, { borderColor: theme.primary ,borderRadius: 50}],
              day.isSelected && [styles.selectedDay, { borderColor: theme.primary,borderRadius: 50 }],
            ]}
            onPress={() => handleDatePress(day)}>
            <TextBox
              variant="body2"
              style={[
                { color: theme.text },
                !day.isCurrentMonth && styles.otherMonthDayText,
                day.isToday && styles.todayText,
                day.isSelected && [styles.selectedDayText],
                day.dayOfWeek === 0 && styles.sundayText,
              ]}>
              {day.day}
            </TextBox>
          </TouchableOpacity>
        ))}
      </View>

      {/* 드래그 영역 - 마지막 row 밑에 border */}
      <View style={[styles.dragArea]}>
        <View style={[styles.dragIndicator, { backgroundColor: theme.border }]} />
      </View>

      {/* DatePicker 모달 */}
      {renderDatePickerModal()}
    </View>
  );
};

return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.calendarContainer, animatedStyle]}>
        {currentView === 'month' ? renderMonthView() : renderWeekView()}
      </Animated.View>
    </GestureDetector>
  </GestureHandlerRootView>
);
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  sundayText: {
    color: '#ff4444',
  },
  week: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  day: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  otherMonthDayText: {
    opacity: 0.7,
  },
  today: {
    borderWidth: 2,
  },
  todayText: {
    fontWeight: 'bold',
  },
  selectedDay: {
    borderWidth: 1,
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  calendarContainer: {
    flex: 1,
  },
  todayButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#4caf50',
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // DatePicker 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  dragArea: {
    height: 20, // 드래그 영역의 높이를 늘려서 터치하기 쉽게
    marginTop: 20, // 드래그 영역 위에 여백
    marginBottom: 10, // 드래그 영역 아래에 여백
    borderBottomWidth: 2, // 하단에 테두리 추가
    borderBottomColor: 'transparent', // 초기에는 투명하게 설정
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
  },
  dragIndicator: {
    width: 60, // 드래그 표시의 너비를 늘림
    height: 4, // 드래그 표시의 높이
    borderRadius: 2, // 드래그 표시의 둥근 정도
    opacity: 0.6, // 투명도 조절
  },
});
