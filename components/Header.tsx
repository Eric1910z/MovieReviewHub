import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query.trim()}`);
      setQuery('');
    }
  };

  return (
    <header className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
        <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-white tracking-wider">
              Movie<span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Review</span>Hub
            </Link>
            <nav className="hidden md:flex items-center gap-6">
                <Link to="/discover" className="text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-300 font-medium">{t('nav.discover')}</Link>
                {auth?.isAuthenticated && (
                    <>
                        <Link to="/watchlist" className="text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-300 font-medium">{t('nav.watchlist')}</Link>
                        <Link to="/admin" className="text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-300 font-medium">{t('nav.admin')}</Link>
                    </>
                )}
            </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full py-2 ps-4 pe-10 w-40 sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            />
             <button type="submit" className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
          </form>
          <LanguageSwitcher />
          <ThemeToggle />
          {auth?.isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-900 dark:text-white font-semibold hidden lg:block">{t('welcome')}, {auth.user?.name}</span>
              <button onClick={auth.logout} className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm">
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300">
                {t('nav.login')}
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;