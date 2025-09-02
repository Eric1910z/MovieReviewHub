import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Movie } from '../types';
import { discoverMovies } from '../services/tmdbService';
import Spinner from '../components/Spinner';
import MovieCard from '../components/MovieCard';
import { useTranslation } from '../hooks/useTranslation';

const GenrePage: React.FC = () => {
  const { genreId, genreName } = useParams<{ genreId: string, genreName: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (!genreId) return;
      try {
        setLoading(true);
        const response = await discoverMovies({ with_genres: genreId, sort_by: 'popularity.desc' });
        setMovies(response.results);
      } catch (error) {
        console.error(`Failed to fetch movies for genre ${genreName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
    window.scrollTo(0, 0);
  }, [genreId, genreName]);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        <span className="text-teal-500 dark:text-teal-400">{genreName}</span> {t('genre.title')}
      </h1>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-slate-500 dark:text-slate-400 mt-12">
          {t('discover.no_results')}
        </p>
      )}
    </div>
  );
};

export default GenrePage;