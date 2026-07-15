"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CastMember, Movie, MovieDetails } from "@/lib/types";
import tmdbLoader from "@/lib/tmdb-image-loader";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

export default function MovieModal({ movie, onClose, onPlay }: MovieModalProps) {
  const [details, setDetails] = useState<(MovieDetails & { cast: CastMember[] }) | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    fetch(`/api/movies/${movie.id}`)
      .then((res) => res.json())
      .then((data) => setDetails(data.movie))
      .catch(() => {});
  }, [movie.id]);

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative z-10 max-h-[90dvh] w-full overflow-y-auto rounded-t-xl bg-[#181818] md:max-h-[85vh] md:max-w-3xl md:rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#181818] text-white md:top-4 md:right-4"
          aria-label="Fechar"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row md:gap-6 md:p-6">
          {poster && (
            <div className="relative mx-auto mt-6 h-48 w-32 shrink-0 md:mx-0 md:mt-0 md:h-72 md:w-48">
              <Image
                src={poster}
                alt={movie.title}
                fill
                loader={tmdbLoader}
                className="rounded object-cover"
                sizes="192px"
              />
            </div>
          )}

          <div className="p-6 pt-4 md:flex-1 md:p-0">
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">{movie.title}</h2>

            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-400">
              {year && <span>{year}</span>}
              {details?.runtime && <span>{details.runtime} min</span>}
              <span className="rounded border border-gray-500 px-1 text-xs">14</span>
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
            </div>

            {details?.genres && (
              <div className="mb-4 flex flex-wrap gap-2">
                {details.genres.map((g) => (
                  <span key={g.id} className="rounded bg-white/10 px-2 py-0.5 text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mb-6 text-sm leading-relaxed text-gray-300 md:text-base">
              {movie.overview || "Sinopse indisponível."}
            </p>

            {details?.cast && details.cast.length > 0 && (
              <p className="mb-6 text-sm text-gray-400">
                <span className="text-gray-500">Elenco: </span>
                {details.cast.map((c) => c.name).join(", ")}
              </p>
            )}

            <button
              onClick={() => onPlay(movie)}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-notflix-red px-6 py-3 font-semibold transition hover:bg-red-700 md:w-auto"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Assistir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
