import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { Movie } from '../types';
import { AuthContext } from './AuthContext';

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isMovieInWatchlist: (movieId: number) => boolean;
}

export const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth?.isAuthenticated) {
        const storedWatchlist = localStorage.getItem('watchlist');
        if (storedWatchlist) {
            setWatchlist(JSON.parse(storedWatchlist));
        }
    } else {
        setWatchlist([]);
        localStorage.removeItem('watchlist');
    }
  }, [auth?.isAuthenticated]);

  useEffect(() => {
    if(auth?.isAuthenticated) {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, auth?.isAuthenticated]);

  const addToWatchlist = (movie: Movie) => {
    if (!isMovieInWatchlist(movie.id)) {
      setWatchlist(prev => [movie, ...prev]);
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
  };
  
  const isMovieInWatchlist = (movieId: number) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const value = { watchlist, addToWatchlist, removeFromWatchlist, isMovieInWatchlist };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};
