
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { translations, language, setLanguage } = context;

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return { t, language, setLanguage };
};