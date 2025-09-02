import React from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';
import { IMAGE_BASE_URL } from '../constants';
import StarRating from './StarRating';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Link to={`/movie/${movie.id}`} className="group block bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg dark:shadow-black/25 hover:shadow-xl hover:shadow-teal-500/20 dark:hover:shadow-teal-400/20 transform hover:-translate-y-1.5 transition-all duration-300">
      <div className="relative">
        <img src={posterUrl} alt={movie.title} className="w-full h-auto aspect-[2/3] object-cover" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <p className="text-white text-center text-sm">{movie.overview.substring(0, 100)}...</p>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-md truncate text-slate-900 dark:text-white">{movie.title}</h3>
        <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">{movie.release_date?.substring(0, 4)}</p>
            <StarRating rating={movie.vote_average} />
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;