// frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 引入剛剛建立的翻譯檔
import enJSON from './locales/en.json';
import zhJSON from './locales/zh.json';

i18n
  .use(LanguageDetector) // 自動偵測使用者語言
  .use(initReactI18next) // 整合 React
  .init({
    resources: {
      en: { translation: enJSON },
      zh: { translation: zhJSON }
    },
    fallbackLng: 'zh', // 預設語言為中文
    interpolation: {
      escapeValue: false // React 已經有防 XSS，所以這裡設為 false
    }
  });

export default i18n;