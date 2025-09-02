import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query.trim()}`);
      setQuery('');
    }
  };

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700/50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-white tracking-wider">
              Movie<span className="text-cyan-400">Review</span>Hub
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
                <Link to="/discover" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">Discover</Link>
                {auth?.isAuthenticated && (
                     <Link to="/watchlist" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">My Watchlist</Link>
                )}
            </nav>
        </div>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie..."
              className="bg-gray-700 text-white rounded-full py-2 px-4 w-64 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
            />
             <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
          </form>
          {auth?.isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="text-white font-semibold">Welcome, {auth.user?.name}</span>
              <button onClick={auth.logout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;