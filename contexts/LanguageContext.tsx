
import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
      const storedLang = localStorage.getItem('language');
      return (storedLang === 'en' || storedLang === 'ar') ? storedLang : 'en';
  });
  
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);

    const fetchTranslations = async () => {
        try {
            // Use fetch to dynamically load the translation file
            const response = await fetch(`./locales/${language}.json`);
            if (!response.ok) {
                throw new Error(`Could not load translations for ${language}`);
            }
            const data = await response.json();
            setTranslations(data);
        } catch (error) {
            console.error("Failed to fetch translations:", error);
            setTranslations({}); // Fallback to empty object on error
        }
    };

    fetchTranslations();
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    translations
  }), [language, translations]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
