import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} MovieReviewHub. {t('footer.rights')}</p>
        <p className="text-sm mt-2">
          {t('footer.tmdb_notice')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;