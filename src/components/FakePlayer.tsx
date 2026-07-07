"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Movie } from "@/lib/types";

const ERROR_MESSAGES = [
  "Não foi possível reproduzir. Tente novamente.",
  "Este conteúdo não está disponível para você.",
  "Assista em outro universo.",
  "O diretor pediu para você não ver isso.",
  "Erro 404: entretenimento não encontrado.",
  "Sua assinatura não cobre a realidade.",
  "O filme fugiu do servidor.",
];

type PlayerState = "buffering" | "error";

interface FakePlayerProps {
  movie: Movie;
  onClose: () => void;
}

export default function FakePlayer({ movie, onClose }: FakePlayerProps) {
  const [state, setState] = useState<PlayerState>("buffering");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startBuffering = useCallback(() => {
    setState("buffering");
    setProgress(0);

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 97) return prev;
        const increment = Math.random() * 3 + 0.5;
        return Math.min(prev + increment, 97);
      });
    }, 400);

    const delay = 5000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setState("error");
      setErrorMessage(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]);
    }, delay);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(startBuffering, 0);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startBuffering]);

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  return (
    <div className="fixed inset-0 z-[60] flex h-dvh flex-col bg-black">
      <div className="relative flex-1">
        {backdrop && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white"
          aria-label="Fechar player"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex h-full flex-col items-center justify-center px-6">
          {state === "buffering" && (
            <>
              <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-notflix-red" />
              <p className="text-lg text-gray-300">Carregando {movie.title}...</p>
              <p className="mt-2 text-sm text-gray-500">{Math.round(progress)}%</p>
            </>
          )}

          {state === "error" && (
            <div className="text-center">
              <div className="mb-4 text-5xl">⚠️</div>
              <p className="mb-6 text-lg text-gray-200 md:text-xl">{errorMessage}</p>
              <button
                onClick={startBuffering}
                className="min-h-[44px] rounded bg-white px-8 py-3 font-semibold text-black transition hover:bg-gray-200"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-t from-black to-transparent px-4 pb-6 pt-4">
        <p className="mb-3 truncate text-sm font-medium">{movie.title}</p>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20 md:h-1">
          <div
            className="h-full rounded-full bg-notflix-red transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex h-11 w-11 items-center justify-center text-white opacity-50" aria-label="Play">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button className="flex h-11 w-11 items-center justify-center text-white opacity-50" aria-label="Volume">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-6-6h.01M6 12a6 6 0 1112 0 6 6 0 01-12 0z" />
              </svg>
            </button>
          </div>
          <button className="flex h-11 w-11 items-center justify-center text-white opacity-50" aria-label="Tela cheia">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
