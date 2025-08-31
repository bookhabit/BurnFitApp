import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";

interface DatePickerModalProps {
  visible: boolean;
  value: Date;
  mode: "date" | "time";
  onChange: (event: any, selectedDate?: Date) => void;
  onRequestClose: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  value,
  mode,
  onChange,
  onRequestClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalOverlay}>
        <DateTimePicker
          value={value}
          mode={mode}
          display="spinner"
          onChange={onChange}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
