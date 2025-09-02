import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../services/tmdbService';
import MovieList from '../components/MovieList';
import Spinner from '../components/Spinner';
import { useTranslation } from '../hooks/useTranslation';

const HomePage: React.FC = () => {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [popularRes, topRatedRes, upcomingRes] = await Promise.all([
            getPopularMovies(),
            getTopRatedMovies(),
            getUpcomingMovies(),
        ]);
        setPopular(popularRes.results);
        setTopRated(topRatedRes.results);
        setUpcoming(upcomingRes.results);
      } catch (error) {
        console.error("Failed to fetch movies for home page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="text-center py-16 md:py-24 px-4 relative overflow-hidden -mt-8 -mx-4 mb-8 bg-slate-100 dark:bg-slate-800">
        <div 
          className="absolute inset-0 bg-dots-pattern opacity-5 dark:opacity-10" 
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '1.25rem 1.25rem',
          }}
        ></div>
        <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                Welcome to <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">MovieReviewHub</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                Your ultimate destination for discovering, discussing, and diving deep into the world of cinema.
            </p>
            <Link to="/discover">
                <button className="mt-8 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                    {t('discover.title')}
                </button>
            </Link>
        </div>
      </div>
      <MovieList title={t('home.popular')} movies={popular} />
      <MovieList title={t('home.top_rated')} movies={topRated} />
      <MovieList title={t('home.upcoming')} movies={upcoming} />
    </div>
  );
};

export default HomePage;