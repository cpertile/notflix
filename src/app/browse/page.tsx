"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  getBaseCategoryId,
  getCategoryBatch,
  getCategoryPage,
} from "@/lib/categories";
import { Movie, MovieRowData } from "@/lib/types";
import FakePlayer from "@/components/FakePlayer";
import HeroBanner from "@/components/HeroBanner";
import InfiniteScroll from "@/components/InfiniteScroll";
import MovieModal from "@/components/MovieModal";
import MovieRow from "@/components/MovieRow";
import Navbar from "@/components/Navbar";

async function fetchRow(categoryId: string, genreId?: number): Promise<Movie[]> {
  const page = getCategoryPage(categoryId);
  const baseId = getBaseCategoryId(categoryId);

  const url =
    baseId === "trending"
      ? `/api/movies/trending?page=${page}`
      : `/api/movies/discover?genreId=${genreId ?? CATEGORIES.find((c) => c.id === baseId)?.genreId}&page=${page}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch row: ${res.status}`);
  }

  const data = await res.json();
  return data.movies ?? [];
}

export default function BrowsePage() {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [rows, setRows] = useState<MovieRowData[]>([]);
  const [rowIndex, setRowIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const loadingRef = useRef(false);

  const loadRows = useCallback(async (startIndex: number, count: number) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);

    try {
      const batch = getCategoryBatch(startIndex, count);

      const newRows = await Promise.all(
        batch.map(async (category) => {
          const movies = await fetchRow(category.id, category.genreId);
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
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const res = await fetch("/api/movies/trending");
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
  }, [loadRows]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.movies ?? []);
    } catch {
      setSearchResults([]);
    }
    setIsSearching(false);
  }, []);

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(null);
    setPlayingMovie(movie);
  };

  const hasMore = rowIndex < CATEGORIES.length * 5;

  return (
    <main className="min-h-dvh bg-[#141414] pb-8">
      <Navbar
        onSearch={handleSearch}
        searchResults={searchResults}
        onSelectMovie={setSelectedMovie}
        isSearching={isSearching}
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
