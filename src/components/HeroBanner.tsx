"use client";

import Image from "next/image";
import { Movie } from "@/lib/types";
import tmdbLoader from "@/lib/tmdb-image-loader";

interface HeroBannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
}

export default function HeroBanner({ movie, onPlay, onInfo }: HeroBannerProps) {
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : null;

  return (
    <section className="relative h-[50vh] w-full md:h-[80vh]">
      {backdrop && (
        <Image
          src={backdrop}
          alt={movie.title}
          fill
          priority
          loader={tmdbLoader}
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

      <div className="absolute bottom-8 left-4 max-w-lg md:bottom-24 md:left-8 md:max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold md:mb-4 md:text-5xl">{movie.title}</h1>
        <p className="mb-4 line-clamp-2 text-sm text-gray-200 md:mb-6 md:line-clamp-3 md:text-lg">
          {movie.overview}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            onClick={() => onPlay(movie)}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-white/80 md:px-8 md:text-base"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Assistir
          </button>
          <button
            onClick={() => onInfo(movie)}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded bg-white/30 px-6 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/40 md:px-8 md:text-base"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mais informações
          </button>
        </div>
      </div>
    </section>
  );
}
