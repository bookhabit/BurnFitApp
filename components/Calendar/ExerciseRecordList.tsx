import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import {
  ExerciseRecord,
  getExerciseRecordsByDate,
  deleteExerciseRecord,
} from "../../lib/database/exerciseDB";
import dayjs from "dayjs";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextBox from "../basic/TextBox";

interface ExerciseRecordListProps {
  selectedDate?: string;
  onRefresh?: () => void;
}

export interface ExerciseRecordListRef {
  refresh: () => void;
}

export const ExerciseRecordList = forwardRef<
  ExerciseRecordListRef,
  ExerciseRecordListProps
>(({ selectedDate, onRefresh }, ref) => {
  const { theme } = useTheme();
  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 선택된 날짜가 없으면 오늘 날짜 사용
  const targetDate = selectedDate || dayjs().format("YYYY-MM-DD");

  // 운동 기록 로드
  const loadExerciseRecords = async () => {
    if (!targetDate) return;

    setIsLoading(true);
    try {
      const records = await getExerciseRecordsByDate(targetDate);
      setExerciseRecords(records);
    } catch (error) {
      console.error("운동 기록 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ref를 통해 외부에서 호출할 수 있는 refresh 메서드
  useImperativeHandle(ref, () => ({
    refresh: loadExerciseRecords,
  }));

  // 운동 기록 삭제
  const handleDeleteRecord = async (recordId: string) => {
    Alert.alert("삭제 확인", "이 운동 기록을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteExerciseRecord(recordId);
            await loadExerciseRecords(); // 목록 새로고침
            onRefresh?.(); // 부모 컴포넌트에 새로고침 알림
          } catch (error) {
            console.error("운동 기록 삭제 실패:", error);
            Alert.alert("오류", "삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  // 날짜가 변경될 때마다 운동 기록 로드
  useEffect(() => {
    loadExerciseRecords();
  }, [targetDate]);

  // 운동 기록이 없을 때 표시할 메시지
  const renderEmptyMessage = () => (
    <View style={styles.emptyContainer}>
      <AntDesign name="calendar" size={48} color={theme.inactive} />
      <TextBox
        variant="body4"
        color={theme.textSecondary}
        style={{ textAlign: "center" }}
      >
        {dayjs(targetDate).format("M월 D일")}에는{"\n"}운동 기록이 없습니다
      </TextBox>
      <TextBox variant="body5" color={theme.textSecondary}>
        플로팅 버튼을 눌러 운동을 기록해보세요!
      </TextBox>
    </View>
  );

  // 운동 기록 아이템 렌더링
  const renderExerciseRecord = ({ item }: { item: ExerciseRecord }) => (
    <View
      style={[
        styles.recordItem,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <View style={styles.recordHeader}>
        <TextBox variant="title5" color={theme.text}>
          {item.exerciseName}
        </TextBox>
        <TouchableOpacity
          onPress={() => handleDeleteRecord(item.id)}
          style={styles.deleteButton}
        >
          <AntDesign name="delete" size={16} color={theme.inactive} />
        </TouchableOpacity>
      </View>

      <View style={styles.recordDetails}>
        <View style={styles.detailItem}>
          <TextBox variant="body4" color={theme.textSecondary}>
            세트
          </TextBox>
          <TextBox variant="body7" color={theme.text}>
            {item.sets}
          </TextBox>
        </View>

        <View style={styles.detailItem}>
          <TextBox variant="body4" color={theme.textSecondary}>
            횟수
          </TextBox>
          <TextBox variant="body7" color={theme.text}>
            {item.reps}
          </TextBox>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <TextBox variant="body4" color={theme.textSecondary}>
              메모
            </TextBox>
            <TextBox variant="body5" color={theme.text}>
              {item.notes}
            </TextBox>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {exerciseRecords.length === 0 ? (
        renderEmptyMessage()
      ) : (
        <FlatList
          data={exerciseRecords}
          renderItem={renderExerciseRecord}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={loadExerciseRecords}
        />
      )}
    </View>
  );
});

ExerciseRecordList.displayName = "ExerciseRecordList";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  recordItem: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  deleteButton: {},
  recordDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    textAlign: "right",
  },
});
