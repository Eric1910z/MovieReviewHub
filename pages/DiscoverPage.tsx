import React, { useState, useEffect, useCallback } from 'react';
import type { Movie, Genre } from '../types';
import { discoverMovies, getGenres } from '../services/tmdbService';
import Spinner from '../components/Spinner';
import MovieCard from '../components/MovieCard';
import { useTranslation } from '../hooks/useTranslation';

const DiscoverPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [rating, setRating] = useState<number>(0);
  
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const filters: { [key: string]: string | number } = {
        sort_by: sortBy,
        'vote_average.gte': rating,
        'primary_release_date.gte': `${year}-01-01`,
        'primary_release_date.lte': `${year}-12-31`,
      };
      if (selectedGenre) {
        filters.with_genres = selectedGenre;
      }
      const response = await discoverMovies(filters);
      setMovies(response.results);
    } catch (error) {
      console.error("Failed to discover movies:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre, sortBy, year, rating]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const genreResponse = await getGenres();
        setGenres(genreResponse.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    const handler = setTimeout(() => {
        fetchMovies();
    }, 500); // Debounce fetching to avoid too many requests
    return () => clearTimeout(handler);
  }, [fetchMovies]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent inline-block">{t('discover.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
        <div>
          <label htmlFor="genre-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('filter.genre')}</label>
          <select
            id="genre-filter"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">{t('filter.all_genres')}</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort-by" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('filter.sort_by')}</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="popularity.desc">{t('filter.popularity_desc')}</option>
            <option value="popularity.asc">{t('filter.popularity_asc')}</option>
            <option value="vote_average.desc">{t('filter.rating_desc')}</option>
            <option value="vote_average.asc">{t('filter.rating_asc')}</option>
            <option value="release_date.desc">{t('filter.release_date_desc')}</option>
            <option value="release_date.asc">{t('filter.release_date_asc')}</option>
          </select>
        </div>
        <div>
            <label htmlFor="year-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('filter.year')}: <span className="font-bold text-teal-600 dark:text-teal-400">{year}</span></label>
            <input type="range" id="year-filter" min="1920" max={currentYear} value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </div>
        <div>
            <label htmlFor="rating-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('filter.min_rating')}: <span className="font-bold text-teal-600 dark:text-teal-400">{rating.toFixed(1)}</span></label>
            <input type="range" id="rating-filter" min="0" max="10" step="0.5" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        </div>
      </div>

      {loading ? <Spinner /> : (
        movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
            </div>
        ) : (
            <p className="text-center text-xl text-slate-500 dark:text-slate-400 mt-12">
                {t('discover.no_results')}
            </p>
        )
      )}
    </div>
  );
};

export default DiscoverPage;