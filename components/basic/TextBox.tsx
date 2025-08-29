
import { darkTheme, lightTheme } from '@/constants/colors';
import { FontKeys, fonts } from '@/constants/fonts';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { currentLanguage } = useLanguage();

  // 언어에 따른 폰트 자동 선택
  const getLanguageAppropriateFont = (variant: VariantKeys) => {
    const baseFont = textStyles[variant].fontFamily;
    
    switch (currentLanguage) {
      case 'ja':
        // 일본어: 일본어 폰트 우선, fallback으로 시스템 폰트
        if (baseFont === fonts.BMJUA) {
          return fonts.Japanese || 'System';
        }
        return fonts.Japanese || 'System';
      
      case 'ko':
        // 한국어: BMJUA 우선, fallback으로 Pretendard
        if (baseFont === fonts.BMJUA) {
          return fonts.BMJUA;
        }
        return baseFont;
      
      case 'en':
      case 'vi':
        // 영어/베트남어: Pretendard 사용
        return baseFont;
      
      default:
        return baseFont;
    }
  };

  // 언어와 폰트에 따른 lineHeight 자동 설정
  const getLanguageAppropriateLineHeight = (variant: VariantKeys) => {
    const baseFontSize = size || textStyles[variant].fontSize;
    
    // variant별 기본 lineHeight 계수
    let baseLineHeightRatio = 1.25; // 기본값
    
    // variant별 조정
    switch (true) {
      case variant.startsWith('title'):
        baseLineHeightRatio = 1.2; // 제목은 더 조밀하게
        break;
      case variant.startsWith('body'):
        baseLineHeightRatio = 1.3; // 본문은 적당하게
        break;
      case variant.startsWith('button'):
        baseLineHeightRatio = 1.25; // 버튼은 기본값
        break;
      case variant.startsWith('caption'):
        baseLineHeightRatio = 1.4; // 캡션은 더 넓게
        break;
      default:
        baseLineHeightRatio = 1.25; // 기본값
        break;
    }
    
    // 언어별 추가 조정
    switch (currentLanguage) {
      case 'en':
        // 영어: 더 넓은 lineHeight (영어는 대문자와 소문자 높이 차이가 큼)
        baseLineHeightRatio += 0.15;
        break;
      
      case 'ja':
        // 일본어: 적당한 lineHeight
        baseLineHeightRatio += 0.05;
        break;
      
      case 'ko':
        // 한국어: BMJUA는 더 넓은 lineHeight 필요
        if (textStyles[variant].fontFamily === fonts.BMJUA) {
          baseLineHeightRatio += 0.1;
        }
        break;
      
      case 'vi':
        // 베트남어: 기본값 유지
        break;
      
      default:
        // 기본값 유지
        break;
    }
    
    return baseFontSize * baseLineHeightRatio;
  };

  // 동적 스타일 계산을 Hook 호출 이후에 수행하고 useMemo로 최적화
  const dynamicStyles = React.useMemo(
    () => ({
      ...textStyles[variant],
      fontFamily: fontsName
        ? fonts[fontsName || 'Pretendard500']
        : getLanguageAppropriateFont(variant),
      fontSize: size || textStyles[variant].fontSize, // size가 있으면 덮어쓰기
      color: TextColor ? TextColor : isDarkMode ? darkTheme.text : lightTheme.text,
      lineHeight: _lineHeight || getLanguageAppropriateLineHeight(variant),
    }),
    [fontsName, size, TextColor, isDarkMode, variant, currentLanguage]
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
