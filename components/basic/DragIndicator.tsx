import React from "react";
import { StyleSheet, View } from "react-native";

interface DragIndicatorProps {
  theme: any;
}

export const DragIndicator: React.FC<DragIndicatorProps> = ({ theme }) => {
  return (
    <View style={styles.dragArea}>
      <View style={[styles.dragIndicator, { backgroundColor: theme.border }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  dragArea: {
    height: 20, // 드래그 영역의 높이를 늘려서 터치하기 쉽게
    marginTop: 20, // 드래그 영역 위에 여백
    marginBottom: 10, // 드래그 영역 아래에 여백
    borderBottomWidth: 2, // 하단에 테두리 추가
    borderBottomColor: "transparent", // 초기에는 투명하게 설정
    justifyContent: "center", // 세로 중앙 정렬
    alignItems: "center", // 가로 중앙 정렬
  },
  dragIndicator: {
    width: 60, // 드래그 표시의 너비를 늘림
    height: 4, // 드래그 표시의 높이
    borderRadius: 2, // 드래그 표시의 둥근 정도
    opacity: 0.6, // 투명도 조절
  },
});
