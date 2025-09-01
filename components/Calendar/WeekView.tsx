import React from "react";
import { StyleSheet, View } from "react-native";
import { CalendarDay as CalendarDayType } from "../../lib/calendarUtils";
import { DragIndicator } from "../basic/DragIndicator";
import { CalendarDay } from "./CalendarDay";
import { CalendarHeader } from "./CalendarHeader";
import { WeekHeader } from "./WeekHeader";

interface WeekViewProps {
  year: number;
  month: number;
  currentWeek: { days: CalendarDayType[] };
  onPrevious: () => void;
  onNext: () => void;
  onHeaderPress: () => void;
  onDatePress: (day: CalendarDayType) => void;
  theme: any;
}

export const WeekView: React.FC<WeekViewProps> = ({
  year,
  month,
  currentWeek,
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

      <View style={styles.week}>
        {currentWeek.days.map((day, dayIndex) => (
          <CalendarDay
            key={dayIndex}
            day={day}
            onPress={onDatePress}
            theme={theme}
          />
        ))}
      </View>

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
