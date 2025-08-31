import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useCalendar } from "../../hooks/useCalendar";
import { useCalendarGestures } from "../../hooks/useCalendarGestures";
import { useDatePicker } from "../../hooks/useDatePicker";
import { CalendarView } from "./CalendarView";
import { DatePickerModal } from "./DatePickerModal";
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

  const { composed, animatedStyle } = useCalendarGestures({
    currentView,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousWeek,
    goToNextWeek,
    changeView,
  });

  const handleDatePress = (day: any) => {
    selectDate(day.date);
  };

  const handleMonthHeaderPress = () => {
    handleHeaderPress(
      calendarData.monthView.year,
      calendarData.monthView.month
    );
  };

  const handleWeekHeaderPress = () => {
    handleHeaderPress(
      calendarData.monthView.year,
      calendarData.monthView.month
    );
  };

  const renderCurrentView = () => {
    if (currentView === "month") {
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
    } else {
      const currentWeek = calendarData.weekView.find(
        (week) => week.weekNumber === currentWeekNumber
      );

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
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.calendarContainer, animatedStyle]}>
          {renderCurrentView()}

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
