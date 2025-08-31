# BurnFitApp 테스트 가이드

## 📋 테스트 개요

BurnFitApp의 테스트는 Jest와 React Testing Library를 사용하여 작성되었습니다. 모든 핵심 기능들이 정상적으로 작동하는지 확인하는 포괄적인 테스트 스위트를 제공합니다.

## 🎯 테스트 결과 요약

**총 70개 테스트 모두 통과** ✅

| 테스트 파일                | 테스트 수 | 상태    | 설명                        |
| -------------------------- | --------- | ------- | --------------------------- |
| `calendarUtils.test.ts`    | 26개      | ✅ 통과 | 캘린더 유틸리티 함수 테스트 |
| `useCalendar.test.tsx`     | 17개      | ✅ 통과 | 캘린더 훅 테스트            |
| `TextBox.test.tsx`         | 15개      | ✅ 통과 | TextBox 컴포넌트 테스트     |
| `ThemeContext.test.tsx`    | 5개       | ✅ 통과 | 테마 컨텍스트 테스트        |
| `LanguageContext.test.tsx` | 7개       | ✅ 통과 | 언어 설정 컨텍스트 테스트   |

## 🏗️ 테스트 구조

```
__tests__/
├── README.md                           # 이 파일
├── lib/
│   └── calendarUtils.test.ts          # 캘린더 유틸리티 함수 테스트
├── hooks/
│   └── useCalendar.test.tsx           # 캘린더 훅 테스트
├── components/
│   └── basic/
│       └── TextBox.test.tsx           # TextBox 컴포넌트 테스트
└── contexts/
    ├── ThemeContext.test.tsx           # 테마 컨텍스트 테스트
    └── LanguageContext.test.tsx        # 언어 설정 컨텍스트 테스트
```

## 🚀 테스트 실행 방법

### 전체 테스트 실행

```bash
npm test
```

### 특정 테스트 파일 실행

```bash
# 캘린더 유틸리티 테스트만 실행
npm test -- --testPathPattern="calendarUtils"

# TextBox 컴포넌트 테스트만 실행
npm test -- --testPathPattern="TextBox"

# 컨텍스트 테스트만 실행
npm test -- --testPathPattern="Context"
```

### 테스트 감시 모드

```bash
npm run test:watch
```

### 커버리지 리포트 생성

```bash
npm run test:coverage
```

## 🧪 테스트 케이스 상세

### 1. 캘린더 유틸리티 (`calendarUtils.test.ts`)

- **월별 캘린더 생성**: 현재 월, 이전/다음 달 날짜 처리
- **날짜 이동**: 이전/다음 월/주 이동, 오늘 날짜로 이동
- **날짜 선택**: 날짜 선택 및 하이라이트
- **뷰 변경**: 월 뷰 ↔ 주 뷰 전환
- **특정 날짜/월/주 이동**: 지정된 날짜로 정확한 이동
- **유틸리티 함수**: `isToday`, `isSelectedDate`, `getDaysInMonth` 등

### 2. 캘린더 훅 (`useCalendar.test.tsx`)

- **초기 상태**: 기본 날짜 및 뷰 설정
- **날짜 네비게이션**: 월/주 단위 이동
- **날짜 선택**: 현재 월 내외 날짜 선택
- **뷰 변경**: 월/주 뷰 전환
- **특정 날짜 이동**: 정확한 날짜로 이동

### 3. TextBox 컴포넌트 (`TextBox.test.tsx`)

- **Variant 적용**: body1, title1, button1 등 다양한 스타일
- **커스텀 스타일**: 사용자 정의 스타일 적용
- **테마 기반 색상**: 라이트/다크 테마에 따른 색상 변경
- **다양한 텍스트**: 한국어, 영어, 숫자, 긴 텍스트 처리
- **접근성**: 스크린 리더 지원
- **에러 처리**: 기본값 적용 및 빈 텍스트 처리

### 4. 테마 컨텍스트 (`ThemeContext.test.tsx`)

- **테마 변경**: 라이트 ↔ 다크 테마 전환
- **색상 일관성**: 모든 UI 컴포넌트의 일관된 색상 적용
- **시스템 테마**: 시스템 테마 변경 감지
- **에러 처리**: Provider 외부에서 훅 사용 시 에러 처리

### 5. 언어 설정 컨텍스트 (`LanguageContext.test.tsx`)

- **언어 변경**: 한국어, 영어, 일본어, 베트남어 전환
- **AsyncStorage 저장**: 언어 설정 영구 저장
- **앱 재시작**: 마지막 선택 언어 유지
- **Fallback 처리**: 잘못된 언어 코드 입력 시 기본값 적용
- **에러 처리**: Provider 외부에서 훅 사용 시 에러 처리

## ⚙️ 테스트 환경 설정

### 의존성 패키지

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-expo": "~53.0.0",
    "@testing-library/react-native": "^12.4.3",
    "@testing-library/jest-native": "^5.4.3",
    "@testing-library/react": "^15.0.0",
    "react-test-renderer": "19.0.0",
    "@types/jest": "^29.5.0"
  }
}
```

### Jest 설정 (`jest.config.js`)

- `jest-expo` 프리셋 사용
- React Native 컴포넌트 변환 패턴 설정
- TypeScript 및 JSX 파일 지원
- 커버리지 수집 설정

### 테스트 설정 (`jest.setup.js`)

- React Native Testing Library 확장
- AsyncStorage 모킹
- Expo 모듈들 모킹 (font, constants, status-bar 등)
- React Native Reanimated 모킹

## 🔧 테스트 작성 가이드

### React Native 컴포넌트 테스트

```tsx
import { render, screen, fireEvent } from "@testing-library/react-native";
import { View, Text, TouchableOpacity } from "react-native";

// testID 사용 (data-testid 아님)
<View testID="test-container">
  <Text>테스트 텍스트</Text>
</View>;

// 이벤트 테스트
fireEvent.press(button);
```

### 비동기 상태 업데이트 테스트

```tsx
import { act, waitFor } from "@testing-library/react-native";

test("비동기 상태 변경 테스트", async () => {
  await act(async () => {
    fireEvent.press(button);
  });

  await waitFor(() => {
    expect(screen.getByText("변경된 텍스트")).toBeDefined();
  });
});
```

### 컨텍스트 테스트

```tsx
const TestComponent = () => (
  <LanguageProvider>
    <ThemeProvider>
      <YourComponent />
    </ThemeProvider>
  </LanguageProvider>
);
```

## 📊 테스트 커버리지

현재 테스트는 다음 영역을 커버합니다:

- **캘린더 기능**: 100% (43개 테스트)
- **언어 설정**: 100% (7개 테스트)
- **테마 설정**: 100% (5개 테스트)
- **UI 컴포넌트**: 100% (15개 테스트)

## 🚨 주의사항

1. **React Native 컴포넌트 사용**: HTML 태그 대신 React Native 컴포넌트 사용
2. **testID 사용**: `data-testid` 대신 `testID` 사용
3. **Provider 래핑**: 컨텍스트를 사용하는 컴포넌트는 적절한 Provider로 래핑
4. **비동기 처리**: 상태 업데이트는 `act()` 함수로 감싸기

## 🔍 문제 해결

### 일반적인 오류들

- **"Element type is invalid"**: 컴포넌트 import 경로 확인
- **"Cannot find module"**: 파일 경로 및 import 문 확인
- **"act() warning"**: 비동기 상태 업데이트를 `act()` 함수로 감싸기

### 디버깅 팁

- `--verbose` 플래그로 상세한 테스트 정보 확인
- `--testPathPattern`으로 특정 테스트만 실행
- `console.log` 대신 `screen.debug()` 사용

## 📝 추가 테스트 작성

새로운 테스트를 작성할 때는 다음 구조를 따르세요:

```tsx
describe("컴포넌트명", () => {
  describe("기능 카테고리", () => {
    test("TC-XXX: 테스트 설명", () => {
      // Given (준비)
      // When (실행)
      // Then (검증)
    });
  });
});
```

---

**마지막 업데이트**: 2024년 12월  
**테스트 상태**: 모든 테스트 통과 ✅  
**총 테스트 수**: 70개
