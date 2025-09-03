# 🔥 BurnFit - 운동 관리 캘린더 앱

번핏(BurnFit)은 운동 관련 사전과제로 개발된 React Native 기반의 운동 관리 캘린더 앱입니다.

## ✨ 주요 기능

### 📱 바텀 탭 네비게이션
- **홈**: 메인 대시보드
- **캘린더**: 운동 일정 관리
- **라이브러리**: 운동 정보 및 기록
- **마이페이지**: 사용자 설정 및 프로필

### 📅 캘린더 기능
- 월간/주간 뷰 전환
- 제스처 기반 네비게이션 (스와이프)
- 날짜 선택 및 운동 일정 관리
- 오늘 날짜로 빠른 이동

### 🌍 다국어 지원
- 한국어 (기본)
- 영어
- 일본어
- 베트남어

### 🎨 테마 설정
- 라이트 모드
- 다크 모드
- 시스템 설정 자동 감지

## 🚀 빌드 및 실행 방법

### 사전 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn
- Expo CLI
- iOS 시뮬레이터 (macOS) 또는 Android 에뮬레이터

### 1. 의존성 설치
```bash
# 기본 설치
npm install

# peer dependencies 경고 무시하고 설치
npm install --legacy-peer-deps

# 또는 yarn 사용 시
yarn install
```

### 2. 개발 서버 시작
```bash
npm start
# 또는
npx expo start
```

### 3. 플랫폼별 실행

#### iOS 시뮬레이터에서 실행
```bash
npm run ios
# 또는
npx expo start --ios
```

#### Android 에뮬레이터에서 실행
```bash
npm run android
# 또는
npx expo start --android
```

#### 웹 브라우저에서 실행
```bash
npm run web
# 또는
npx expo start --web
```

### 4. Expo Go 앱으로 테스트
- Expo Go 앱을 모바일 기기에 설치
- QR 코드를 스캔하여 앱 실행

## 🧪 테스트 실행

```bash
# 전체 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch

# 테스트 커버리지 확인
npm run test:coverage
```

## 📁 프로젝트 구조

```
burnfit/
├── app/                    # Expo Router 기반 앱 구조
│   ├── (tabs)/           # 바텀 탭 네비게이션
│   │   ├── index.tsx     # 홈 화면
│   │   ├── calendar.tsx  # 캘린더 화면
│   │   ├── library.tsx   # 라이브러리 화면
│   │   └── my-page.tsx   # 마이페이지 화면
│   └── _layout.tsx       # 루트 레이아웃
├── components/            # 재사용 가능한 컴포넌트
│   ├── Calendar/         # 캘린더 관련 컴포넌트
│   ├── basic/            # 기본 UI 컴포넌트
│   └── modal/            # 모달 컴포넌트
├── contexts/              # React Context
│   ├── ThemeContext.tsx  # 테마 관리
│   └── LanguageContext.tsx # 다국어 관리
├── hooks/                 # 커스텀 훅
├── lib/                   # 유틸리티 및 설정
│   └── i18n/             # 국제화 설정
├── constants/             # 상수 정의
└── __tests__/            # 테스트 파일
```

## 🛠 기술 스택

- **프레임워크**: React Native 0.79.6
- **네비게이션**: Expo Router 5.1.5
- **상태 관리**: React Context API
- **국제화**: i18next + react-i18next
- **애니메이션**: React Native Reanimated
- **제스처**: React Native Gesture Handler
- **테스트**: Jest + React Testing Library
- **개발 도구**: Expo SDK 53

## 📱 지원 플랫폼

- iOS (iPhone, iPad)
- Android
- 웹 브라우저

## 🔧 개발 스크립트

```bash
# 프로젝트 리셋 (새로운 개발 시작 시)
npm run reset-project

# 린트 검사
npm run lint

# 타입 체크
npx tsc --noEmit
```

## 📝 환경 설정

### iOS 개발
- Xcode 15.0 이상
- iOS 13.0 이상 타겟팅

### Android 개발
- Android Studio
- Android SDK 33 이상
- Java 11 이상

## 🚨 문제 해결

### 일반적인 문제들

1. **Metro 번들러 오류**
   ```bash
   npx expo start --clear
   ```

2. **의존성 충돌**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. **Peer dependencies 경고**
   ```bash
   npm install --legacy-peer-deps
   # 또는
   npm install --force
   ```

4. **캐시 클리어**
   ```bash
   npx expo start --clear
   ```
---

**번핏**으로 운동을 체계적으로 관리하고 건강한 라이프스타일을 만들어보세요! 💪
