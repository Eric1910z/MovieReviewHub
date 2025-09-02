
import React, { useContext } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import PersonDetailPage from './pages/PersonDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DiscoverPage from './pages/DiscoverPage';
import WatchlistPage from './pages/WatchlistPage';
import GenrePage from './pages/GenrePage';
import AdminPage from './pages/AdminPage';
import { AuthContext } from './contexts/AuthContext';

const App: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/person/:id" element={<PersonDetailPage />} />
            <Route path="/search/:query" element={<SearchResultsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/genre/:genreId/:genreName" element={<GenrePage />} />
            {/* Simple mock auth check for admin page */}
            {auth?.isAuthenticated && <Route path="/admin" element={<AdminPage />} />}
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;