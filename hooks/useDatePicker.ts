import { useState } from "react";

interface UseDatePickerProps {
  goToDate: (year: number, month: number, day: number) => void;
  initialDate?: Date;
}

export const useDatePicker = ({
  goToDate,
  initialDate = new Date(),
}: UseDatePickerProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState(initialDate);

  const handleHeaderPress = (year: number, month: number) => {
    setTempDate(new Date(year, month, 1));
    setPickerMode("date");
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

  return {
    showDatePicker,
    pickerMode,
    tempDate,
    handleHeaderPress,
    handleDatePickerChange,
    handleDatePickerCancel,
  };
};
