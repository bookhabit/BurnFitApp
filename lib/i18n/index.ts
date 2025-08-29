import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, ja, ko, vi } from './locales';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
  ja: { translation: ja },
  vi: { translation: vi },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko', // 기본 언어
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
