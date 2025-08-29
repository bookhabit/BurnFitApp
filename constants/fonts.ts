export const fonts = {
    Pretendard800: 'Pretendard-ExtraBold', // 800
    Pretendard700: 'Pretendard-Bold', // 700
    Pretendard600: 'Pretendard-SemiBold', // 600
    Pretendard500: 'Pretendard-Medium', // 500
    Pretendard400: 'Pretendard-Regular', // 400
    Pretendard300: 'Pretendard-Light', // 300
    Pretendard200: 'Pretendard-ExtraLight', // 200
    Pretendard100: 'Pretendard-Thin', // 100
    BMJUA: 'BMJUA',
    // 일본어 지원 폰트 추가
    Japanese: 'Hiragino Sans', // iOS 기본 일본어 폰트
    JapaneseAndroid: 'Noto Sans JP', // Android 기본 일본어 폰트
  } as const;
  
  export type FontKeys = keyof typeof fonts;
  