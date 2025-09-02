import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useTranslation();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as 'en' | 'ar';
        setLanguage(newLang);
    };

    return (
        <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-md py-2 ps-2 pe-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Select language"
        >
            <option value="en">EN</option>
            <option value="ar">AR</option>
        </select>
    );
};

export default LanguageSwitcher;