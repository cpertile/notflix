export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number | null;
}

export interface CastMember {
  name: string;
  character: string;
}

export interface Category {
  id: string;
  title: string;
  genreId?: number;
}

export interface MovieRowData {
  id: string;
  title: string;
  movies: Movie[];
}
