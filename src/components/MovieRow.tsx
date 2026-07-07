"use client";

import { Movie } from "@/lib/types";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

export default function MovieRow({ title, movies, onSelect, onPlay }: MovieRowProps) {
  if (movies.length === 0) return null;

  return (
    <section className="mb-6 md:mb-8">
      <h2 className="mb-3 px-4 text-base font-semibold md:px-8 md:text-xl">{title}</h2>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-2 snap-x snap-mandatory md:gap-3 md:px-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onSelect={onSelect} onPlay={onPlay} />
        ))}
      </div>
    </section>
  );
}
