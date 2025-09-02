import React, { useState, useEffect, useCallback } from 'react';
import type { Movie, Genre } from '../types';
import { discoverMovies, getGenres } from '../services/tmdbService';
import Spinner from '../components/Spinner';
import MovieCard from '../components/MovieCard';

const DiscoverPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(true);
  
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const filters: { [key: string]: string | number } = {
        sort_by: sortBy,
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
  }, [selectedGenre, sortBy]);

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
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-cyan-300 border-l-4 border-cyan-400 pl-4">Discover Movies</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-gray-800 rounded-lg">
        <div className="flex-1">
          <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
          <select
            id="genre-filter"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="sort-by" className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="popularity.desc">Popularity Descending</option>
            <option value="popularity.asc">Popularity Ascending</option>
            <option value="vote_average.desc">Rating Descending</option>
            <option value="vote_average.asc">Rating Ascending</option>
            <option value="release_date.desc">Release Date Descending</option>
            <option value="release_date.asc">Release Date Ascending</option>
          </select>
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
            <p className="text-center text-xl text-gray-400 mt-12">
                No movies found with the selected filters.
            </p>
        )
      )}
    </div>
  );
};

export default DiscoverPage;
