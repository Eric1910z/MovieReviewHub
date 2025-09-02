
import React from 'react';
import type { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieListProps {
  title: string;
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ title, movies }) => {
  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 border-l-4 border-cyan-400 pl-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
