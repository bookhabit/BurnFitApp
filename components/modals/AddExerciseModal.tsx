import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { addExerciseRecord } from "../../lib/database/exerciseDB";
import dayjs from "dayjs";

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate?: string; // YYYY-MM-DD format
  onExerciseAdded: () => void;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onExerciseAdded,
}) => {
  const { theme } = useTheme();
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 선택된 날짜가 없으면 오늘 날짜 사용
  const targetDate = selectedDate || dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (visible) {
      // 모달이 열릴 때마다 입력 필드 초기화
      setExerciseName("");
      setSets("");
      setReps("");
      setNotes("");
    }
  }, [visible]);

  const handleSubmit = async () => {
    // 입력 검증
    if (!exerciseName.trim()) {
      Alert.alert("오류", "운동 이름을 입력해주세요.");
      return;
    }

    if (!sets.trim() || !reps.trim()) {
      Alert.alert("오류", "세트 수와 횟수를 입력해주세요.");
      return;
    }

    const setsNum = parseInt(sets);
    const repsNum = parseInt(reps);

    if (isNaN(setsNum) || setsNum <= 0) {
      Alert.alert("오류", "올바른 세트 수를 입력해주세요.");
      return;
    }

    if (isNaN(repsNum) || repsNum <= 0) {
      Alert.alert("오류", "올바른 횟수를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await addExerciseRecord(
        targetDate,
        exerciseName.trim(),
        setsNum,
        repsNum,
        notes.trim() || undefined
      );

      Alert.alert("성공", "운동 기록이 추가되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            onExerciseAdded();
            onClose();
          },
        },
      ]);
    } catch (error) {
      console.error("운동 기록 추가 실패:", error);
      Alert.alert("오류", "운동 기록 추가에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (exerciseName.trim() || sets.trim() || reps.trim() || notes.trim()) {
      Alert.alert("취소", "입력한 내용이 있습니다. 정말 취소하시겠습니까?", [
        { text: "계속 입력", style: "cancel" },
        { text: "취소", onPress: onClose },
      ]);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View
          style={[styles.modalContent, { backgroundColor: theme.background }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              운동 기록 추가
            </Text>
            <Text style={[styles.dateText, { color: theme.inactive }]}>
              {dayjs(targetDate).format("YYYY년 M월 D일")}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                운동 이름 *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={exerciseName}
                onChangeText={setExerciseName}
                placeholder="예: 스쿼트, 벤치프레스, 데드리프트..."
                placeholderTextColor={theme.inactive}
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={[styles.label, { color: theme.text }]}>
                  세트 수 *
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.surface,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  value={sets}
                  onChangeText={setSets}
                  placeholder="3"
                  placeholderTextColor={theme.inactive}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={[styles.label, { color: theme.text }]}>
                  횟수 *
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.surface,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  value={reps}
                  onChangeText={setReps}
                  placeholder="10"
                  placeholderTextColor={theme.inactive}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>메모</Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={notes}
                onChangeText={setNotes}
                placeholder="운동에 대한 추가 정보나 느낀 점을 기록해보세요..."
                placeholderTextColor={theme.inactive}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                취소
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                { backgroundColor: theme.primary },
                isLoading && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, { color: "white" }]}>
                {isLoading ? "추가 중..." : "추가"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  modalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  submitButton: {
    // backgroundColor는 props로 전달
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
