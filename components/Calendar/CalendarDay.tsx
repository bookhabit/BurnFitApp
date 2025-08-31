import React from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { CalendarDay as CalendarDayType } from "../../lib/calendarUtils";
import TextBox from "../basic/TextBox";

interface CalendarDayProps {
  day: CalendarDayType;
  onPress: (day: CalendarDayType) => void;
  theme: any;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onPress,
  theme,
}) => {
  const getDayStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.day];

    if (!day.isCurrentMonth) {
      baseStyle.push(styles.otherMonthDay);
    }

    if (day.isToday) {
      baseStyle.push(styles.today);
    }

    if (day.isSelected) {
      baseStyle.push(styles.selectedDay);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [{ color: theme.text }];

    if (!day.isCurrentMonth) {
      baseStyle.push(styles.otherMonthDayText);
    }

    if (day.isToday) {
      baseStyle.push(styles.todayText);
    }

    if (day.isSelected) {
      baseStyle.push(styles.selectedDayText);
    }

    if (day.dayOfWeek === 0) {
      baseStyle.push(styles.sundayText);
    }

    return baseStyle;
  };

  // 날짜 상태에 따른 적절한 variant 선택
  const getDateVariant = () => {
    if (day.isToday || day.isSelected) {
      return "body4"; // Pretendard500 (Medium) - 더 강조된 텍스트
    }
    return "body2"; // Pretendard400 (Regular) - 기본 텍스트
  };

  return (
    <TouchableOpacity style={getDayStyle()} onPress={() => onPress(day)}>
      <TextBox variant={getDateVariant()} style={getTextStyle()}>
        {day.day}
      </TextBox>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  day: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  otherMonthDayText: {
    opacity: 0.7,
  },
  today: {
    borderWidth: 1,
    borderRadius: 50,
  },
  todayText: {
    // fontWeight 제거 - TextBox variant에서 처리
  },
  selectedDay: {
    borderWidth: 1,
    borderRadius: 50,
  },
  selectedDayText: {
    // fontWeight 제거 - TextBox variant에서 처리
  },
  sundayText: {
    color: "#ff4444",
  },
});
