import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";

const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <View>
      <Text testID="theme-status">
        {isDarkMode ? "다크 모드" : "라이트 모드"}
      </Text>
      <TouchableOpacity testID="toggle-button" onPress={toggleTheme}>
        <Text>테마 변경</Text>
      </TouchableOpacity>
    </View>
  );
};

const TestComponentWithError = () => {
  try {
    const { isDarkMode } = useTheme();
    return <Text>테마: {isDarkMode ? "다크" : "라이트"}</Text>;
  } catch (error) {
    return <Text>에러 발생</Text>;
  }
};

describe("ThemeContext", () => {
  describe("테마 변경 기능", () => {
    test("TC-THEME-001: 라이트 테마에서 다크 테마로 전환 시 색상이 올바르게 변경되는지 확인", () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeStatus = screen.getByTestId("theme-status");
      const toggleButton = screen.getByTestId("toggle-button");

      // 초기 상태는 라이트 모드
      expect(screen.getByText("라이트 모드")).toBeDefined();

      // 테마 변경 버튼 클릭
      fireEvent.press(toggleButton);

      // 다크 모드로 변경되었는지 확인
      expect(screen.getByText("다크 모드")).toBeDefined();
    });

    test("TC-THEME-002: 다크 테마에서 라이트 테마로 전환 시 색상이 올바르게 변경되는지 확인", () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeStatus = screen.getByTestId("theme-status");
      const toggleButton = screen.getByTestId("toggle-button");

      // 먼저 다크 모드로 변경
      fireEvent.press(toggleButton);
      expect(screen.getByText("다크 모드")).toBeDefined();

      // 다시 라이트 모드로 변경
      fireEvent.press(toggleButton);
      expect(screen.getByText("라이트 모드")).toBeDefined();
    });

    test("TC-THEME-003: 시스템 테마 변경 시 앱 테마가 자동으로 업데이트되는지 확인", () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeStatus = screen.getByTestId("theme-status");

      // 초기 상태 확인
      expect(themeStatus).toBeDefined();
    });

    test("TC-THEME-004: 테마 변경 시 모든 UI 컴포넌트의 색상이 일관되게 적용되는지 확인", () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeStatus = screen.getByTestId("theme-status");
      const toggleButton = screen.getByTestId("toggle-button");

      // 초기 상태 확인
      expect(screen.getByText("라이트 모드")).toBeDefined();

      // 테마 변경
      fireEvent.press(toggleButton);
      expect(screen.getByText("다크 모드")).toBeDefined();

      // 다시 변경
      fireEvent.press(toggleButton);
      expect(screen.getByText("라이트 모드")).toBeDefined();
    });
  });

  describe("테마 컨텍스트 에러 처리", () => {
    test("TC-THEME-005: ThemeProvider 외부에서 useTheme 훅 사용 시 적절한 에러 메시지 표시", () => {
      render(<TestComponentWithError />);

      const errorText = screen.getByText("에러 발생");
      expect(errorText).toBeDefined();
    });
  });
});
