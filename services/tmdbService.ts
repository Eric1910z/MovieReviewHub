import { API_BASE_URL, API_KEY } from '../constants';
import type { Movie, MovieListResponse, Credits, Person, PersonMovieCredits, GenreListResponse } from '../types';

const fetchData = async <T,>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });
  const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok for ${url}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};

export const getPopularMovies = (): Promise<MovieListResponse> => {
  return fetchData<MovieListResponse>('/movie/popular');
};

export const getTopRatedMovies = (): Promise<MovieListResponse> => {
    return fetchData<MovieListResponse>('/movie/top_rated');
};

export const getUpcomingMovies = (): Promise<MovieListResponse> => {
    return fetchData<MovieListResponse>('/movie/upcoming');
};

export const getMovieDetails = (id: string): Promise<Movie> => {
  return fetchData<Movie>(`/movie/${id}`);
};

export const getMovieCredits = (id: string): Promise<Credits> => {
  return fetchData<Credits>(`/movie/${id}/credits`);
};

export const getSimilarMovies = (id: string): Promise<MovieListResponse> => {
  return fetchData<MovieListResponse>(`/movie/${id}/similar`);
};

export const searchMovies = (query: string): Promise<MovieListResponse> => {
  return fetchData<MovieListResponse>(`/search/movie`, { query: query });
};

export const getPersonDetails = (id: string): Promise<Person> => {
    return fetchData<Person>(`/person/${id}`);
};

export const getPersonMovieCredits = (id: string): Promise<PersonMovieCredits> => {
    return fetchData<PersonMovieCredits>(`/person/${id}/movie_credits`);
};

export const getGenres = (): Promise<GenreListResponse> => {
    return fetchData<GenreListResponse>('/genre/movie/list');
};

export const discoverMovies = (filters: { [key: string]: string | number }): Promise<MovieListResponse> => {
    const params: Record<string, string> = {};
    for (const key in filters) {
        params[key] = String(filters[key]);
    }
    return fetchData<MovieListResponse>('/discover/movie', params);
};