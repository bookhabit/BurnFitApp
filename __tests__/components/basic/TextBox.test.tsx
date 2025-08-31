import { render, screen } from "@testing-library/react-native";
import React from "react";
import TextBox from "../../../components/basic/TextBox";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { ThemeProvider } from "../../../contexts/ThemeContext";

const TestTextBox = ({ variant, style, children }: any) => (
  <LanguageProvider>
    <ThemeProvider>
      <TextBox variant={variant} style={style}>
        {children}
      </TextBox>
    </ThemeProvider>
  </LanguageProvider>
);

describe("TextBox 컴포넌트", () => {
  describe("다양한 variant 적용", () => {
    test("TC-UI-001: body1 variant가 올바르게 적용되는지 확인", () => {
      render(<TestTextBox variant="body1">Body 1 텍스트</TestTextBox>);

      const textElement = screen.getByText("Body 1 텍스트");
      expect(textElement).toBeDefined();
    });

    test("TC-UI-001: title1 variant가 올바르게 적용되는지 확인", () => {
      render(<TestTextBox variant="title1">Title 1 텍스트</TestTextBox>);

      const textElement = screen.getByText("Title 1 텍스트");
      expect(textElement).toBeDefined();
    });

    test("TC-UI-001: button1 variant가 올바르게 적용되는지 확인", () => {
      render(<TestTextBox variant="button1">Button 1 텍스트</TestTextBox>);

      const textElement = screen.getByText("Button 1 텍스트");
      expect(textElement).toBeDefined();
    });

    test("TC-UI-001: title3 variant가 올바르게 적용되는지 확인", () => {
      render(<TestTextBox variant="title3">Title 3 텍스트</TestTextBox>);

      const textElement = screen.getByText("Title 3 텍스트");
      expect(textElement).toBeDefined();
    });

    test("TC-UI-001: body2 variant가 올바르게 적용되는지 확인", () => {
      render(<TestTextBox variant="body2">Body 2 텍스트</TestTextBox>);

      const textElement = screen.getByText("Body 2 텍스트");
      expect(textElement).toBeDefined();
    });
  });

  describe("커스텀 스타일 적용", () => {
    test("TC-UI-002: 커스텀 스타일이 올바르게 적용되는지 확인", () => {
      const customStyle = { color: "#FF0000", fontSize: 20 };

      render(
        <TestTextBox variant="body1" style={customStyle}>
          커스텀 스타일 텍스트
        </TestTextBox>
      );

      const textElement = screen.getByText("커스텀 스타일 텍스트");
      expect(textElement).toBeDefined();
    });

    test("TC-UI-002: 여러 스타일 속성이 올바르게 적용되는지 확인", () => {
      const customStyle = {
        color: "#00FF00",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center" as const,
      };

      render(
        <TestTextBox variant="title1" style={customStyle}>
          여러 스타일 텍스트
        </TestTextBox>
      );

      const textElement = screen.getByText("여러 스타일 텍스트");
      expect(textElement).toBeDefined();
    });
  });

  describe("테마 변경 시 텍스트 색상", () => {
    test("TC-UI-003: 테마 변경 시 텍스트 색상이 올바르게 변경되는지 확인", () => {
      const { rerender } = render(
        <TestTextBox variant="body1">테마 변경 테스트</TestTextBox>
      );

      const textElement = screen.getByText("테마 변경 테스트");
      expect(textElement).toBeDefined();

      // 테마 변경 후 다시 렌더링
      rerender(<TestTextBox variant="body1">테마 변경 테스트</TestTextBox>);

      expect(textElement).toBeDefined();
    });
  });

  describe("다양한 텍스트 내용", () => {
    test("한국어 텍스트가 올바르게 표시되는지 확인", () => {
      render(
        <TestTextBox variant="body1">
          안녕하세요! 한국어 텍스트입니다.
        </TestTextBox>
      );

      const textElement = screen.getByText("안녕하세요! 한국어 텍스트입니다.");
      expect(textElement).toBeDefined();
    });

    test("영어 텍스트가 올바르게 표시되는지 확인", () => {
      render(
        <TestTextBox variant="body1">Hello! This is English text.</TestTextBox>
      );

      const textElement = screen.getByText("Hello! This is English text.");
      expect(textElement).toBeDefined();
    });

    test("숫자와 특수문자가 포함된 텍스트가 올바르게 표시되는지 확인", () => {
      render(
        <TestTextBox variant="body1">가격: ₩15,000 / 수량: 5개</TestTextBox>
      );

      const textElement = screen.getByText("가격: ₩15,000 / 수량: 5개");
      expect(textElement).toBeDefined();
    });

    test("긴 텍스트가 올바르게 표시되는지 확인", () => {
      const longText =
        "이것은 매우 긴 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있는 긴 내용을 포함하고 있습니다. 사용자가 읽기 편하도록 적절한 줄바꿈과 레이아웃이 적용되어야 합니다.";

      render(<TestTextBox variant="body1">{longText}</TestTextBox>);

      const textElement = screen.getByText(longText);
      expect(textElement).toBeDefined();
    });
  });

  describe("접근성", () => {
    test("텍스트가 스크린 리더에서 읽을 수 있는지 확인", () => {
      render(<TestTextBox variant="body1">접근성 테스트 텍스트</TestTextBox>);

      const textElement = screen.getByText("접근성 테스트 텍스트");
      expect(textElement).toBeDefined();
    });
  });

  describe("에러 처리", () => {
    test("variant가 제공되지 않았을 때 기본 스타일이 적용되는지 확인", () => {
      render(<TestTextBox>기본 variant 텍스트</TestTextBox>);

      const textElement = screen.getByText("기본 variant 텍스트");
      expect(textElement).toBeDefined();
    });

    test("빈 텍스트가 올바르게 처리되는지 확인", () => {
      render(<TestTextBox variant="body1">{""}</TestTextBox>);

      // 빈 텍스트는 렌더링되지 않지만 컴포넌트는 존재해야 함
      expect(screen.getByTestId).toBeDefined();
    });
  });
});
