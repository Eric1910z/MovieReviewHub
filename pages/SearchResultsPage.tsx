
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Movie } from '../types';
import { searchMovies } from '../services/tmdbService';
import Spinner from '../components/Spinner';
import MovieCard from '../components/MovieCard';

const SearchResultsPage: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const response = await searchMovies(query);
        setResults(response.results);
      } catch (error) {
        console.error("Failed to perform search:", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Search Results for <span className="text-cyan-400">"{query}"</span>
      </h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-400 mt-12">
          No movies found matching your search.
        </p>
      )}
    </div>
  );
};

export default SearchResultsPage;
