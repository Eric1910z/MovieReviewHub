import React, { useContext } from 'react';
import { WatchlistContext } from '../contexts/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const WatchlistPage: React.FC = () => {
  const watchlistContext = useContext(WatchlistContext);

  if (!watchlistContext) {
    return (
        <div className="text-center">
            <p>Could not load watchlist.</p>
        </div>
    );
  }

  const { watchlist } = watchlistContext;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-cyan-300 border-l-4 border-cyan-400 pl-4">My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center text-xl text-gray-400 mt-12">
          <p>Your watchlist is empty.</p>
          <p className="mt-4">
            <Link to="/discover" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300">
                Discover Movies to Add
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
