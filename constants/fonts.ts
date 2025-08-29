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
  } as const;
  
  export type FontKeys = keyof typeof fonts;
  