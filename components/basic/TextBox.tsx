
import { darkTheme, lightTheme } from '@/constants/colors';
import { FontKeys, fonts } from '@/constants/fonts';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

type VariantKeys =
  | 'title1'
  | 'title2'
  | 'title3'
  | 'title4'
  | 'title5'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'body5'
  | 'body6'
  | 'body7'
  | 'button1'
  | 'button2'
  | 'button3'
  | 'button4'
  | 'caption1'
  | 'caption2'
  | 'caption3';

interface TextBoxProps extends TextProps {
  fontsName?: FontKeys;
  size?: number;
  _lineHeight?: number;
  color?: string;
  variant?: VariantKeys;
}

const textStyles = {
  title1: { fontSize: 26, fontFamily: fonts['BMJUA'] },
  title2: { fontSize: 24, fontFamily: fonts['BMJUA'] },
  title3: { fontSize: 22, fontFamily: fonts['BMJUA'] },
  title4: { fontSize: 20, fontFamily: fonts['BMJUA'] },
  title5: { fontSize: 18, fontFamily: fonts['BMJUA'] },

  body1: { fontSize: 17, fontFamily: fonts['Pretendard400'] },
  body2: { fontSize: 16, fontFamily: fonts['Pretendard400'] },
  body3: { fontSize: 15, fontFamily: fonts['Pretendard400'] },
  body4: { fontSize: 14, fontFamily: fonts['Pretendard500'] },
  body5: { fontSize: 14, fontFamily: fonts['Pretendard400'] },
  body6: { fontSize: 13, fontFamily: fonts['Pretendard400'] },
  body7: { fontSize: 16, fontFamily: fonts['Pretendard500'] },

  button1: {
    fontSize: 18,
    fontFamily: fonts['Pretendard500'],
  },
  button2: {
    fontSize: 16,
    fontFamily: fonts['Pretendard500'],
  },
  button3: {
    fontSize: 14,
    fontFamily: fonts['Pretendard500'],
  },
  button4: {
    fontSize: 12,
    fontFamily: fonts['Pretendard500'],
  },

  caption1: {
    fontSize: 13,
    fontFamily: fonts['Pretendard400'],
  },
  caption2: {
    fontSize: 12,
    fontFamily: fonts['Pretendard500'],
  },
  caption3: {
    fontSize: 12,
    fontFamily: fonts['Pretendard400'],
  },
};

const TextBox: React.FC<TextBoxProps> = ({
  fontsName,
  size,
  _lineHeight,
  color: TextColor,
  children,
  style,
  variant = 'body1',
  ...props
}) => {

  const { isDarkMode } = useTheme();

  // 동적 스타일 계산을 Hook 호출 이후에 수행하고 useMemo로 최적화
  const dynamicStyles = React.useMemo(
    () => ({
      ...textStyles[variant],
      fontFamily: fontsName
        ? fonts[fontsName || 'Pretendard500']
        : textStyles[variant].fontFamily,
      fontSize: size || textStyles[variant].fontSize, // size가 있으면 덮어쓰기
      color: TextColor ? TextColor : isDarkMode ? darkTheme.text : lightTheme.text,
    }),
    [fontsName, size, TextColor, isDarkMode, variant]
  );

  return (
    <Text style={[styles.text, dynamicStyles, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14, // 기본 폰트 크기 설정
    fontFamily: 'Pretendard-Regular', // 기본 폰트 패밀리 설정
  },
});

export default TextBox;
