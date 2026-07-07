import { CastMember, Movie, MovieDetails } from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY is not configured");
  }
  return key;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("language", "pt-BR");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

interface TMDBListResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

export async function getTrendingMovies(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>("/trending/movie/week", {
    page: String(page),
  });
  return data.results;
}

export async function discoverMoviesByGenre(genreId: number, page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    page: String(page),
  });
  return data.results;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<TMDBListResponse>("/search/movie", {
    query: query.trim(),
    page: "1",
  });
  return data.results;
}

export async function getMovieDetails(id: number): Promise<MovieDetails & { cast: CastMember[] }> {
  const [movie, credits] = await Promise.all([
    tmdbFetch<MovieDetails>(`/movie/${id}`),
    tmdbFetch<{ cast: CastMember[] }>(`/movie/${id}/credits`),
  ]);

  return {
    ...movie,
    cast: credits.cast.slice(0, 6),
  };
}

export function posterUrl(path: string | null, size: "w342" | "w500" | "w780" | "original" = "w500"): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function backdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "w1280"): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
