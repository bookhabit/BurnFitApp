import { useTheme } from "@/contexts/ThemeContext";
import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useCalendar } from "../../hooks/useCalendar";
import { useCalendarGestures } from "../../hooks/useCalendarGestures";
import { useDatePicker } from "../../hooks/useDatePicker";
import { CalendarDay as CalendarDayType } from "../../lib/calendarUtils";
import { DatePickerModal } from "../modal/DatePickerModal";
import { AddExerciseModal } from "../modals/AddExerciseModal";
import {
  ExerciseRecordList,
  ExerciseRecordListRef,
} from "./ExerciseRecordList";
import { CalendarView } from "./CalendarView";
import { WeekView } from "./WeekView";
import AntDesign from "@expo/vector-icons/AntDesign";
import { initExerciseDatabase } from "../../lib/database/exerciseDB";
import dayjs from "dayjs";

const Calendar: React.FC = () => {
  const { theme } = useTheme();
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const exerciseListRef = useRef<ExerciseRecordListRef>(null);

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

  const {
    showDatePicker,
    pickerMode,
    tempDate,
    handleHeaderPress,
    handleDatePickerChange,
    handleDatePickerCancel,
  } = useDatePicker({ goToDate });

  // 데이터베이스 초기화
  useEffect(() => {
    initExerciseDatabase().catch(console.error);
  }, []);

  // 제스처 설정을 메모이제이션
  const gestureConfig = useMemo(
    () => ({
      currentView,
      goToPreviousMonth,
      goToNextMonth,
      goToPreviousWeek,
      goToNextWeek,
      changeView,
    }),
    [
      currentView,
      goToPreviousMonth,
      goToNextMonth,
      goToPreviousWeek,
      goToNextWeek,
      changeView,
    ]
  );

  const { composed, animatedStyle } = useCalendarGestures(gestureConfig);

  // 현재 주 데이터를 메모이제이션
  const currentWeek = useMemo(() => {
    return calendarData.weekView.find(
      (week) => week.weekNumber === currentWeekNumber
    );
  }, [calendarData.weekView, currentWeekNumber]);

  // 이벤트 핸들러들을 useCallback으로 메모이제이션
  const handleDatePress = useCallback(
    (day: CalendarDayType) => {
      selectDate(day.date);
      // 날짜 선택 시 selectedDate 업데이트
      if (typeof day.date === "string") {
        setSelectedDate(day.date);
      } else {
        setSelectedDate(day.date.format("YYYY-MM-DD"));
      }
    },
    [selectDate]
  );

  const handleMonthHeaderPress = useCallback(() => {
    handleHeaderPress(
      calendarData.monthView.year,
      calendarData.monthView.month
    );
  }, [
    handleHeaderPress,
    calendarData.monthView.year,
    calendarData.monthView.month,
  ]);

  const handleWeekHeaderPress = useCallback(() => {
    handleHeaderPress(
      calendarData.monthView.year,
      calendarData.monthView.month
    );
  }, [
    handleHeaderPress,
    calendarData.monthView.year,
    calendarData.monthView.month,
  ]);

  // 플로팅 버튼 클릭 핸들러
  const handleFloatingButtonPress = useCallback(() => {
    setShowAddExerciseModal(true);
  }, []);

  // 운동 기록 추가 완료 핸들러
  const handleExerciseAdded = useCallback(() => {
    // 운동 기록 목록 새로고침
    if (exerciseListRef.current) {
      exerciseListRef.current.refresh();
    }
    // console.log 제거 - 불필요한 로그 출력 방지
  }, []);

  // 월뷰 렌더링을 메모이제이션
  const monthView = useMemo(() => {
    return (
      <CalendarView
        year={calendarData.monthView.year}
        month={calendarData.monthView.month}
        weeks={calendarData.monthView.weeks}
        onPrevious={goToPreviousMonth}
        onNext={goToNextMonth}
        onHeaderPress={handleMonthHeaderPress}
        onDatePress={handleDatePress}
        theme={theme}
      />
    );
  }, [
    calendarData.monthView.year,
    calendarData.monthView.month,
    calendarData.monthView.weeks,
    goToPreviousMonth,
    goToNextMonth,
    handleMonthHeaderPress,
    handleDatePress,
    theme,
  ]);

  // 주뷰 렌더링을 메모이제이션
  const weekView = useMemo(() => {
    if (!currentWeek) return null;

    return (
      <WeekView
        year={calendarData.monthView.year}
        month={calendarData.monthView.month}
        currentWeek={currentWeek}
        onPrevious={goToPreviousWeek}
        onNext={goToNextWeek}
        onHeaderPress={handleWeekHeaderPress}
        onDatePress={handleDatePress}
        theme={theme}
      />
    );
  }, [
    currentWeek,
    calendarData.monthView.year,
    calendarData.monthView.month,
    goToPreviousWeek,
    goToNextWeek,
    handleWeekHeaderPress,
    handleDatePress,
    theme,
  ]);

  // 현재 뷰 렌더링을 메모이제이션
  const currentViewComponent = useMemo(() => {
    if (currentView === "month") {
      return monthView;
    } else {
      return weekView;
    }
  }, [currentView, monthView, weekView]);

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.calendarContainer, animatedStyle]}>
            {/* 캘린더 뷰 */}
            <View style={styles.calendarSection}>{currentViewComponent}</View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>

      {/* 운동 기록 목록 */}
      <View style={styles.exerciseSection}>
        <ExerciseRecordList
          ref={exerciseListRef}
          selectedDate={selectedDate}
          onRefresh={handleExerciseAdded}
        />
      </View>

      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.primary }]}
        onPress={handleFloatingButtonPress}
        activeOpacity={0.8}
      >
        <AntDesign name="plus" size={24} color={theme.background} />
      </TouchableOpacity>

      {/* 운동 기록 추가 모달 */}
      <AddExerciseModal
        visible={showAddExerciseModal}
        onClose={() => setShowAddExerciseModal(false)}
        selectedDate={selectedDate}
        onExerciseAdded={handleExerciseAdded}
      />

      <DatePickerModal
        visible={showDatePicker}
        value={tempDate}
        mode={pickerMode}
        onChange={handleDatePickerChange}
        onRequestClose={handleDatePickerCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
    minHeight: "30%",
  },
  calendarContainer: {
    flex: 1,
    position: "relative",
  },
  calendarSection: {
    flex: 1,
  },
  exerciseSection: {
    flexGrow: 1,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Calendar;
