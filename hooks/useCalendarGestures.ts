import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SWIPE_THRESHOLD = 80;

interface UseCalendarGesturesProps {
  currentView: "month" | "week";
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  changeView: (view: "month" | "week") => void;
}

export const useCalendarGestures = ({
  currentView,
  goToPreviousMonth,
  goToNextMonth,
  goToPreviousWeek,
  goToNextWeek,
  changeView,
}: UseCalendarGesturesProps) => {
  // X/Y 위치값 (스와이프)
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  /** 가로 스와이프 제스처 */
  const panX = Gesture.Pan()
    .onUpdate((e) => {
      // 드래그 중에는 캘린더를 움직이지 않고 시각적 피드백만 제공
      if (Math.abs(e.translationX) > 20) {
        // 드래그가 임계값을 넘으면 방향 힌트 표시 (선택사항)
        // 여기서는 캘린더를 움직이지 않음
      }
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(currentView === "month" ? goToNextMonth : goToNextWeek)();
      } else if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(
          currentView === "month" ? goToPreviousMonth : goToPreviousWeek
        )();
      }
      // 제스처 완료 후 위치 초기화
      translateX.value = withSpring(0);
    });

  /** 세로 스와이프 제스처 (월 <-> 주 뷰 전환) */
  const panY = Gesture.Pan()
    .onUpdate((e) => {
      // 드래그 중에는 캘린더를 움직이지 않고 시각적 피드백만 제공
      if (Math.abs(e.translationY) > 20) {
        // 드래그가 임계값을 넘으면 방향 힌트 표시 (선택사항)
        // 여기서는 캘린더를 움직이지 않음
      }
    })
    .onEnd((e) => {
      if (e.translationY < -SWIPE_THRESHOLD && currentView === "month") {
        runOnJS(changeView)("week");
      } else if (e.translationY > SWIPE_THRESHOLD && currentView === "week") {
        runOnJS(changeView)("month");
      }
      // 제스처 완료 후 위치 초기화
      translateY.value = withSpring(0);
    });

  const composed = Gesture.Simultaneous(panX, panY);

  /** 애니메이션 스타일 */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return {
    composed,
    animatedStyle,
  };
};
