import React, { useContext } from 'react';
import { WatchlistContext } from '../contexts/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const WatchlistPage: React.FC = () => {
  const watchlistContext = useContext(WatchlistContext);
  const { t } = useTranslation();

  if (!watchlistContext) {
    return (
        <div className="text-center">
            <p>{t('watchlist.load_error')}</p>
        </div>
    );
  }

  const { watchlist } = watchlistContext;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent inline-block">{t('watchlist.title')}</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center text-xl text-slate-500 dark:text-slate-400 mt-12">
          <p>{t('watchlist.empty')}</p>
          <p className="mt-4">
            <Link to="/discover" className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300">
                {t('watchlist.discover_button')}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;