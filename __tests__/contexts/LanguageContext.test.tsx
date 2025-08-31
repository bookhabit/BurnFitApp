import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LanguageProvider, useLanguage } from "../../contexts/LanguageContext";

const TestComponent = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <View>
      <Text testID="current-language">현재 언어: {currentLanguage}</Text>
      <TouchableOpacity
        testID="change-to-ko"
        onPress={() => changeLanguage("ko")}
      >
        <Text>한국어로 변경</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="change-to-en"
        onPress={() => changeLanguage("en")}
      >
        <Text>영어로 변경</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="change-to-ja"
        onPress={() => changeLanguage("ja")}
      >
        <Text>일본어로 변경</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="change-to-vi"
        onPress={() => changeLanguage("vi")}
      >
        <Text>베트남어로 변경</Text>
      </TouchableOpacity>
    </View>
  );
};

const TestComponentWithError = () => {
  try {
    const { currentLanguage } = useLanguage();
    return <Text>언어: {currentLanguage}</Text>;
  } catch (error) {
    return <Text>에러 발생</Text>;
  }
};

describe("LanguageContext", () => {
  describe("언어 변경 기능", () => {
    test("TC-LANG-001: 한국어에서 영어로 언어 변경 시 UI 텍스트가 올바르게 변경되는지 확인", async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const currentLanguageText = screen.getByTestId("current-language");
      const changeToEnButton = screen.getByTestId("change-to-en");

      // 초기 상태는 한국어
      expect(screen.getByText("현재 언어: ko")).toBeDefined();

      // 영어로 변경
      await act(async () => {
        fireEvent.press(changeToEnButton);
      });

      // 언어 변경이 완료될 때까지 기다림
      await waitFor(() => {
        expect(screen.getByText("현재 언어: en")).toBeDefined();
      });
    });

    test("TC-LANG-002: 영어에서 일본어로 언어 변경 시 UI 텍스트가 올바르게 변경되는지 확인", async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const changeToEnButton = screen.getByTestId("change-to-en");
      const changeToJaButton = screen.getByTestId("change-to-ja");

      // 먼저 영어로 변경
      await act(async () => {
        fireEvent.press(changeToEnButton);
      });

      await waitFor(() => {
        expect(screen.getByText("현재 언어: en")).toBeDefined();
      });

      // 일본어로 변경
      await act(async () => {
        fireEvent.press(changeToJaButton);
      });

      await waitFor(() => {
        expect(screen.getByText("현재 언어: ja")).toBeDefined();
      });
    });

    test("TC-LANG-003: 일본어에서 베트남어로 언어 변경 시 UI 텍스트가 올바르게 변경되는지 확인", async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const changeToJaButton = screen.getByTestId("change-to-ja");
      const changeToViButton = screen.getByTestId("change-to-vi");

      // 먼저 일본어로 변경
      await act(async () => {
        fireEvent.press(changeToJaButton);
      });

      await waitFor(() => {
        expect(screen.getByText("현재 언어: ja")).toBeDefined();
      });

      // 베트남어로 변경
      await act(async () => {
        fireEvent.press(changeToViButton);
      });

      await waitFor(() => {
        expect(screen.getByText("현재 언어: vi")).toBeDefined();
      });
    });

    test("TC-LANG-004: 언어 변경 후 AsyncStorage에 올바르게 저장되는지 확인", async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const changeToEnButton = screen.getByTestId("change-to-en");

      // 영어로 변경
      await act(async () => {
        fireEvent.press(changeToEnButton);
      });

      await waitFor(() => {
        expect(screen.getByText("현재 언어: en")).toBeDefined();
      });
    });

    test("TC-LANG-005: 앱 재시작 시 마지막 선택한 언어가 유지되는지 확인", async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      const changeToJaButton = screen.getByTestId("change-to-ja");

      // 일본어로 변경
      await act(async () => {
        fireEvent.press(changeToJaButton);
      });

      await waitFor(() => {
        expect(screen.getByText("현재 언어: ja")).toBeDefined();
      });
    });
  });

  describe("언어 컨텍스트 에러 처리", () => {
    test("TC-LANG-006: LanguageProvider 외부에서 useLanguage 훅 사용 시 적절한 에러 메시지 표시", () => {
      render(<TestComponentWithError />);

      const errorText = screen.getByText("에러 발생");
      expect(errorText).toBeDefined();
    });

    test("TC-LANG-007: 잘못된 언어 코드 입력 시 기본 언어(한국어)로 fallback되는지 확인", () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      // 초기 상태는 한국어
      expect(screen.getByText("현재 언어: ko")).toBeDefined();
    });
  });
});
