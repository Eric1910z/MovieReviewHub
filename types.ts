export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  runtime: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
}

export interface MovieListResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface Person {
    id: number;
    name: string;
    biography: string;
    profile_path: string | null;
    birthday: string | null;
    place_of_birth: string | null;
    known_for_department: string;
}

export interface PersonMovieCredits {
    cast: Movie[];
    crew: Movie[];
}

export interface Genre {
    id: number;
    name: string;
}

export interface GenreListResponse {
    genres: Genre[];
}

export interface Review {
    id?: number;
    username: string;
    rating: number;
    content: string;
    created_at: string;
    movie_id?: number;
}