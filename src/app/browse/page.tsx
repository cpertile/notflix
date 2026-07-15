"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  getBaseCategoryId,
  getCategoryBatch,
  getCategoryPage,
  KIDS_CATEGORIES,
} from "@/lib/categories";
import {
  isKidsProfile,
  parseStoredProfile,
  PROFILE_STORAGE_KEY,
  Profile,
  PROFILES,
} from "@/lib/profiles";
import { Movie, MovieRowData } from "@/lib/types";
import FakePlayer from "@/components/FakePlayer";
import HeroBanner from "@/components/HeroBanner";
import InfiniteScroll from "@/components/InfiniteScroll";
import MovieModal from "@/components/MovieModal";
import MovieRow from "@/components/MovieRow";
import Navbar from "@/components/Navbar";

async function fetchRow(
  categoryId: string,
  genreId: number | undefined,
  categories: typeof CATEGORIES,
  kids: boolean
): Promise<Movie[]> {
  const page = getCategoryPage(categoryId);
  const baseId = getBaseCategoryId(categoryId);
  const kidsParam = kids ? "&kids=1" : "";

  const url =
    baseId === "trending"
      ? `/api/movies/trending?page=${page}${kidsParam}`
      : `/api/movies/discover?genreId=${genreId ?? categories.find((c) => c.id === baseId)?.genreId}&page=${page}${kidsParam}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch row: ${res.status}`);
  }

  const data = await res.json();
  return data.movies ?? [];
}

export default function BrowsePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [rows, setRows] = useState<MovieRowData[]>([]);
  const [rowIndex, setRowIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const loadingRef = useRef(false);

  const kids = isKidsProfile(profile);
  const categories = kids ? KIDS_CATEGORIES : CATEGORIES;

  useEffect(() => {
    const parsed = parseStoredProfile(localStorage.getItem(PROFILE_STORAGE_KEY)) ?? PROFILES[0];
    setProfile(parsed);
    setProfileReady(true);
  }, []);

  const loadRows = useCallback(
    async (startIndex: number, count: number) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setIsLoading(true);

      try {
        const batch = getCategoryBatch(startIndex, count, categories);

        const newRows = await Promise.all(
          batch.map(async (category) => {
            const movies = await fetchRow(category.id, category.genreId, categories, kids);
            return { id: category.id, title: category.title, movies };
          })
        );

        setRows((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const unique = newRows.filter((r) => !existingIds.has(r.id));
          return [...prev, ...unique];
        });
        setRowIndex(startIndex + count);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
    [categories, kids]
  );

  useEffect(() => {
    if (!profileReady || !profile) return;

    let cancelled = false;
    loadingRef.current = false;
    setRows([]);
    setRowIndex(0);
    setHeroMovie(null);
    setSelectedMovie(null);
    setSearchResults([]);

    async function init() {
      try {
        const trendingUrl = kids ? "/api/movies/trending?kids=1" : "/api/movies/trending";
        const res = await fetch(trendingUrl);
        const data = await res.json();
        if (!cancelled && data.movies?.length > 0) {
          setHeroMovie(data.movies[0]);
        }
      } catch {
        // ignore
      }

      if (!cancelled) {
        await loadRows(0, 4);
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [profileReady, profile, kids, loadRows]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const kidsParam = kids ? "&kids=1" : "";
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}${kidsParam}`);
        const data = await res.json();
        setSearchResults(data.movies ?? []);
      } catch {
        setSearchResults([]);
      }
      setIsSearching(false);
    },
    [kids]
  );

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(null);
    setPlayingMovie(movie);
  };

  const hasMore = rowIndex < categories.length * 5;

  return (
    <main className="min-h-dvh bg-[#141414] pb-8">
      <Navbar
        onSearch={handleSearch}
        searchResults={searchResults}
        onSelectMovie={setSelectedMovie}
        isSearching={isSearching}
        profile={profile}
      />

      {heroMovie && (
        <HeroBanner
          movie={heroMovie}
          onPlay={handlePlay}
          onInfo={setSelectedMovie}
        />
      )}

      <div className={heroMovie ? "-mt-8 relative z-10" : "pt-16"}>
        {rows.map((row) => (
          <MovieRow
            key={row.id}
            title={row.title}
            movies={row.movies}
            onSelect={setSelectedMovie}
            onPlay={handlePlay}
          />
        ))}
      </div>

      <InfiniteScroll
        onLoadMore={() => loadRows(rowIndex, 3)}
        isLoading={isLoading}
        hasMore={hasMore && rowIndex > 0}
      />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={handlePlay}
        />
      )}

      {playingMovie && (
        <FakePlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />
      )}
    </main>
  );
}
