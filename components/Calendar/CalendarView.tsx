import React from "react";
import { StyleSheet, View } from "react-native";
import { lightTheme } from "../../constants/colors";
import { CalendarDay as CalendarDayType } from "../../lib/calendarUtils";
import { DragIndicator } from "../basic/DragIndicator";
import { CalendarDay } from "./CalendarDay";
import { CalendarHeader } from "./CalendarHeader";
import { WeekHeader } from "./WeekHeader";

interface CalendarViewProps {
  year: number;
  month: number;
  weeks: Array<{ days: CalendarDayType[] }>;
  onPrevious: () => void;
  onNext: () => void;
  onHeaderPress: () => void;
  onDatePress: (day: CalendarDayType) => void;
  theme: typeof lightTheme;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  year,
  month,
  weeks,
  onPrevious,
  onNext,
  onHeaderPress,
  onDatePress,
  theme,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CalendarHeader
        year={year}
        month={month}
        onPrevious={onPrevious}
        onNext={onNext}
        onHeaderPress={onHeaderPress}
      />

      <WeekHeader />

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.days.map((day, dayIndex) => (
            <CalendarDay
              key={dayIndex}
              day={day}
              onPress={onDatePress}
              theme={theme}
            />
          ))}
        </View>
      ))}

      <DragIndicator theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  week: {
    flexDirection: "row",
    marginBottom: 8,
  },
});
