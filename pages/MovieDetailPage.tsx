import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Movie, Cast, Movie as SimilarMovie, Review } from '../types';
import { getMovieDetails, getMovieCredits, getSimilarMovies } from '../services/tmdbService';
import { getReviews, postReview } from '../services/apiService';
import { IMAGE_BASE_URL } from '../constants';
import Spinner from '../components/Spinner';
import StarRating from '../components/StarRating';
import MovieList from '../components/MovieList';
import CastMember from '../components/CastMember';
import { AuthContext } from '../contexts/AuthContext';
import { WatchlistContext } from '../contexts/WatchlistContext';
import { useTranslation } from '../hooks/useTranslation';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<SimilarMovie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  const auth = useContext(AuthContext);
  const watchlist = useContext(WatchlistContext);
  const { t } = useTranslation();

  const isMovieInWatchlist = movie ? watchlist?.isMovieInWatchlist(movie.id) : false;

  const fetchMovieReviews = async () => {
      if (!id) return;
      try {
          const fetchedReviews = await getReviews(parseInt(id, 10));
          setReviews(fetchedReviews);
      } catch (error) {
          console.error("Failed to fetch reviews:", error);
      }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [movieDetails, movieCredits, similarMovies] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getSimilarMovies(id),
        ]);
        setMovie(movieDetails);
        setCredits(movieCredits.cast);
        setSimilar(similarMovies.results);
        await fetchMovieReviews();
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchDetails();
  }, [id]);
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (reviewContent.trim() && reviewRating > 0 && auth?.user && id) {
          const reviewData = {
              username: auth.user.name,
              rating: reviewRating * 2, // convert 5-star to 10-point
              content: reviewContent,
          };
          try {
              await postReview(parseInt(id, 10), reviewData);
              // Refresh reviews after posting
              await fetchMovieReviews();
              setReviewContent('');
              setReviewRating(0);
          } catch(error) {
              console.error('Failed to submit review', error);
              alert('Failed to submit review.');
          }
      }
  };

  const handleWatchlistToggle = () => {
      if (!movie) return;
      if (isMovieInWatchlist) {
          watchlist?.removeFromWatchlist(movie.id);
      } else {
          watchlist?.addToWatchlist(movie);
      }
  }

  if (loading) return <Spinner />;
  if (!movie) return <div className="text-center text-xl">{t('movie.not_found')}</div>;

  const backdropUrl = movie.backdrop_path ? `${IMAGE_BASE_URL}original${movie.backdrop_path}` : '';
  const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div>
      <div className="relative -mx-4 -mt-8 h-[60vh] max-h-[500px]">
        {backdropUrl && <img src={backdropUrl} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-slate-50/20 dark:via-slate-900/40 to-transparent"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative -mt-48 container mx-auto px-4">
        <div className="md:flex items-end md:space-x-8">
            <div className="flex-shrink-0 w-1/2 md:w-1/4 max-w-[250px] mx-auto md:mx-0">
                <img src={posterUrl} alt={movie.title} className="rounded-lg shadow-2xl w-full" />
            </div>
            <div className="mt-6 md:mt-0 text-center md:text-left">
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">{movie.title}</h1>
                <div className="flex items-center justify-center md:justify-start flex-wrap gap-x-4 gap-y-2 mt-2 text-slate-600 dark:text-slate-300">
                    <span>{movie.release_date?.substring(0, 4)}</span>
                    <span>•</span>
                    <span>{movie.runtime} min</span>
                    <span>•</span>
                    <StarRating rating={movie.vote_average} />
                    <span className="text-sm">({movie.vote_count.toLocaleString()} {t('movie.votes')})</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    {movie.genres.map(genre => (
                        <Link to={`/genre/${genre.id}/${genre.name}`} key={genre.id} className="bg-slate-200 dark:bg-slate-700 text-teal-700 dark:text-teal-300 text-xs font-semibold px-3 py-1 rounded-full hover:bg-teal-200 dark:hover:bg-teal-600 transition-colors">{genre.name}</Link>
                    ))}
                </div>
                 {auth?.isAuthenticated && (
                    <button onClick={handleWatchlistToggle} className={`mt-6 font-semibold py-2 px-6 rounded-full transition duration-300 flex items-center gap-2 text-white ${isMovieInWatchlist ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"  className={isMovieInWatchlist ? 'hidden' : 'block'} />
                           <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" className={!isMovieInWatchlist ? 'hidden' : 'block'}/>
                        </svg>
                        <span>{isMovieInWatchlist ? t('movie.remove_watchlist') : t('movie.add_watchlist')}</span>
                    </button>
                )}
            </div>
        </div>

        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-4">{t('movie.overview')}</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">{movie.overview}</p>
        </div>

        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">{t('movie.cast')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {credits.slice(0, 12).map(member => (
                    <CastMember key={member.id} member={member} />
                ))}
            </div>
        </div>
        
        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">{t('movie.reviews')}</h2>
            <div className="max-w-4xl">
              {auth?.isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold mb-4">{t('review.add_yours')}</h3>
                      <div className="mb-4">
                          <label className="block mb-2 font-medium">{t('review.rating')}</label>
                          <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                  <svg key={star} onClick={() => setReviewRating(star)} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 cursor-pointer transition-colors ${reviewRating >= star ? 'text-yellow-400' : 'text-slate-400 dark:text-slate-500 hover:text-yellow-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                              ))}
                          </div>
                      </div>
                      <textarea value={reviewContent} onChange={e => setReviewContent(e.target.value)} placeholder={t('review.placeholder')} className="w-full bg-slate-200 dark:bg-slate-700 p-3 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" rows={4}></textarea>
                      <button type="submit" className="mt-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-2 px-5 rounded-full transition duration-300">{t('review.submit')}</button>
                  </form>
              ) : (
                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg mb-8 text-center">
                      <p><Link to="/login" className="text-teal-500 dark:text-teal-400 font-semibold hover:underline">{t('review.login_prompt')}</Link> {t('review.login_prompt_suffix')}</p>
                  </div>
              )}
              <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border-s-4 border-slate-300 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-lg">{review.username}</p>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="my-2">
                           <StarRating rating={review.rating} />
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{review.content}</p>
                    </div>
                ))}
              </div>
            </div>
        </div>

        {similar.length > 0 && 
            <div className="mt-12">
                <MovieList title={t('movie.similar')} movies={similar} />
            </div>
        }
      </div>
    </div>
  );
};

export default MovieDetailPage;