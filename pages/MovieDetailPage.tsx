import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Movie, Cast, Movie as SimilarMovie, Review } from '../types';
import { getMovieDetails, getMovieCredits, getSimilarMovies } from '../services/tmdbService';
import { IMAGE_BASE_URL } from '../constants';
import Spinner from '../components/Spinner';
import StarRating from '../components/StarRating';
import MovieList from '../components/MovieList';
import CastMember from '../components/CastMember';
import { AuthContext } from '../contexts/AuthContext';
import { WatchlistContext } from '../contexts/WatchlistContext';

const initialReviews: Review[] = [
    { author: 'CinemaFan92', rating: 9.2, content: 'An absolute masterpiece! The visuals were stunning and the story was compelling. A must-watch!', createdAt: '2 days ago' },
    { author: 'MovieCriticPro', rating: 7.8, content: 'A solid film with great performances, though the plot was a bit predictable. Still, a very enjoyable experience.', createdAt: '5 days ago' }
];

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<SimilarMovie[]>([]);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(true);
  
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  const auth = useContext(AuthContext);
  const watchlist = useContext(WatchlistContext);

  const isMovieInWatchlist = movie ? watchlist?.isMovieInWatchlist(movie.id) : false;

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
        setReviews(initialReviews); // Reset reviews on new movie load
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchDetails();
  }, [id]);
  
  const handleReviewSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (reviewContent.trim() && reviewRating > 0 && auth?.user) {
          const newReview: Review = {
              author: auth.user.name,
              rating: reviewRating * 2, // convert 5-star to 10-point
              content: reviewContent,
              createdAt: 'Just now'
          };
          setReviews([newReview, ...reviews]);
          setReviewContent('');
          setReviewRating(0);
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
  if (!movie) return <div className="text-center text-xl">Movie not found.</div>;

  const backdropUrl = movie.backdrop_path ? `${IMAGE_BASE_URL}original${movie.backdrop_path}` : '';
  const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div>
      <div className="relative -mx-4 -mt-8 h-[60vh] max-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        {backdropUrl && <img src={backdropUrl} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative -mt-48 container mx-auto px-4">
        <div className="md:flex items-end md:space-x-8">
            <div className="flex-shrink-0 w-1/2 md:w-1/4 max-w-[250px]">
                <img src={posterUrl} alt={movie.title} className="rounded-lg shadow-2xl w-full" />
            </div>
            <div className="mt-6 md:mt-0 text-left">
                <h1 className="text-4xl lg:text-5xl font-black text-white">{movie.title}</h1>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-gray-300">
                    <span>{movie.release_date?.substring(0, 4)}</span>
                    <span>•</span>
                    <span>{movie.runtime} min</span>
                    <span>•</span>
                    <StarRating rating={movie.vote_average} />
                    <span className="text-sm">({movie.vote_count.toLocaleString()} votes)</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {movie.genres.map(genre => (
                        <span key={genre.id} className="bg-gray-700 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full">{genre.name}</span>
                    ))}
                </div>
                 {auth?.isAuthenticated && (
                    <button onClick={handleWatchlistToggle} className={`mt-6 font-semibold py-2 px-6 rounded-full transition duration-300 flex items-center space-x-2 ${isMovieInWatchlist ? 'bg-amber-500 hover:bg-amber-600' : 'bg-cyan-500 hover:bg-cyan-600'} text-white`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"  className={isMovieInWatchlist ? 'hidden' : 'block'} />
                           <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" className={!isMovieInWatchlist ? 'hidden' : 'block'}/>
                        </svg>
                        <span>{isMovieInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                    </button>
                )}
            </div>
        </div>

        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed max-w-4xl">{movie.overview}</p>
        </div>

        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Top Billed Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {credits.slice(0, 12).map(member => (
                    <CastMember key={member.id} member={member} />
                ))}
            </div>
        </div>
        
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
            <div className="max-w-4xl">
              {auth?.isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="bg-gray-800 p-6 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold mb-4">Add Your Review</h3>
                      <div className="mb-4">
                          <label className="block mb-2">Rating</label>
                          <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                  <svg key={star} onClick={() => setReviewRating(star)} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 cursor-pointer transition-colors ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                              ))}
                          </div>
                      </div>
                      <textarea value={reviewContent} onChange={e => setReviewContent(e.target.value)} placeholder="Write your review..." className="w-full bg-gray-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" rows={4}></textarea>
                      <button type="submit" className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-5 rounded-full transition duration-300">Submit Review</button>
                  </form>
              ) : (
                  <div className="bg-gray-800 p-6 rounded-lg mb-8 text-center">
                      <p><Link to="/login" className="text-cyan-400 font-semibold hover:underline">Log in</Link> to add your review.</p>
                  </div>
              )}
              <div className="space-y-6">
                {reviews.map((review, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border-l-4 border-gray-700">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-lg">{review.author}</p>
                            <span className="text-xs text-gray-400">{review.createdAt}</span>
                        </div>
                        <div className="my-2">
                           <StarRating rating={review.rating} />
                        </div>
                        <p className="text-gray-300">{review.content}</p>
                    </div>
                ))}
              </div>
            </div>
        </div>

        {similar.length > 0 && 
            <div className="mt-12">
                <MovieList title="Similar Movies" movies={similar} />
            </div>
        }
      </div>
    </div>
  );
};

export default MovieDetailPage;