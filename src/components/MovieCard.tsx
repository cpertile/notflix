"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Movie } from "@/lib/types";
import tmdbLoader from "@/lib/tmdb-image-loader";

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

export default function MovieCard({ movie, onSelect, onPlay }: MovieCardProps) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
    : null;
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !poster) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [poster]);

  return (
    <div
      ref={rootRef}
      className="group relative w-28 shrink-0 snap-start cursor-pointer sm:w-32 md:w-40 lg:w-48"
      onClick={() => onSelect(movie)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded bg-[#1f1f1f] transition duration-300 md:group-hover:scale-110 md:group-hover:z-10">
        {poster && shouldLoad ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            loader={tmdbLoader}
            className="object-cover"
            sizes="(max-width: 768px) 112px, 192px"
          />
        ) : poster ? null : (
          <div className="flex h-full items-center justify-center text-xs text-gray-500">
            Sem imagem
          </div>
        )}

        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100 md:flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(movie);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black/50 transition hover:bg-white hover:text-black"
            aria-label="Assistir"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black/50 transition hover:bg-white hover:text-black"
            aria-label="Adicionar à lista"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
