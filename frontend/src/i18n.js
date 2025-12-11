// frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 引入翻譯檔
import enJSON from './locales/en.json';
import zhJSON from './locales/zh.json';

i18n
  .use(LanguageDetector) // 使用語言偵測
  .use(initReactI18next) // 整合 React
  .init({
    resources: {
      en: { translation: enJSON },
      zh: { translation: zhJSON }
    },
    fallbackLng: 'zh', // 若偵測失敗，預設回中文
    
    // ✨ 新增：強化偵測設定
    detection: {
      // 偵測順序：先看 localStorage，再看瀏覽器設定
      order: ['localStorage', 'navigator'],
      // 這裡指定將語言快取到 localStorage
      caches: ['localStorage'], 
    },
    
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;