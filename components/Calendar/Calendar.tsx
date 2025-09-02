import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo, useCallback } from "react";
import { StyleSheet } from "react-native";
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
import { CalendarView } from "./CalendarView";
import { WeekView } from "./WeekView";

const Calendar: React.FC = () => {
  const { theme } = useTheme();

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
    <GestureHandlerRootView style={styles.gestureRoot}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.calendarContainer, animatedStyle]}>
          {currentViewComponent}

          <DatePickerModal
            visible={showDatePicker}
            value={tempDate}
            mode={pickerMode}
            onChange={handleDatePickerChange}
            onRequestClose={handleDatePickerCancel}
          />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
  },
});

export default Calendar;
