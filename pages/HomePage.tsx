
import React, { useState, useEffect } from 'react';
import type { Movie } from '../types';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../services/tmdbService';
import MovieList from '../components/MovieList';
import Spinner from '../components/Spinner';

const HomePage: React.FC = () => {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

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
      <MovieList title="Popular Movies" movies={popular} />
      <MovieList title="Top Rated Movies" movies={topRated} />
      <MovieList title="Upcoming Movies" movies={upcoming} />
    </div>
  );
};

export default HomePage;
