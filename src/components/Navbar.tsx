"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Movie } from "@/lib/types";
import tmdbLoader from "@/lib/tmdb-image-loader";

interface NavbarProps {
  onSearch: (query: string) => void;
  searchResults: Movie[];
  onSelectMovie: (movie: Movie) => void;
  isSearching: boolean;
}

export default function Navbar({ onSearch, searchResults, onSelectMovie, isSearching }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSelect = (movie: Movie) => {
    onSelectMovie(movie);
    setSearchOpen(false);
    setQuery("");
  };

  const searchPanel = (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Títulos, gêneros..."
        className="w-full rounded bg-black/70 px-4 py-2 text-sm text-white outline-none ring-1 ring-white/30 focus:ring-white md:w-56 lg:w-72"
        autoFocus={searchOpen}
      />
      {query && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded bg-[#1f1f1f] shadow-xl md:left-auto md:w-72">
          {isSearching ? (
            <p className="p-4 text-sm text-gray-400">Buscando...</p>
          ) : searchResults.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">Nenhum resultado</p>
          ) : (
            searchResults.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleSelect(movie)}
                className="flex w-full items-center gap-3 p-3 text-left hover:bg-white/10"
              >
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    width={40}
                    height={60}
                    loader={tmdbLoader}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="h-[60px] w-10 rounded bg-gray-700" />
                )}
                <span className="text-sm">{movie.title}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-40 transition-colors duration-300 ${
          scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white md:hidden"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/browse" className="text-xl font-bold text-notflix-red md:text-2xl">
              Notflix
            </Link>

            <div className="hidden items-center gap-5 text-sm text-gray-300 md:flex">
              <Link href="/browse" className="transition hover:text-white">
                Início
              </Link>
              <span className="cursor-default transition hover:text-white">Séries</span>
              <span className="cursor-default transition hover:text-white">Filmes</span>
              <span className="cursor-default transition hover:text-white">Bombando</span>
              <span className="cursor-default transition hover:text-white">Minha lista</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white md:hidden"
              aria-label="Buscar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className="hidden md:block">{searchPanel}</div>

            <Link href="/" className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-sm">
              😎
            </Link>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#141414] p-4 pt-16 md:hidden">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-4 right-4 text-white"
            aria-label="Fechar busca"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {searchPanel}
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-64 bg-[#141414] p-6 pt-16">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-white"
              aria-label="Fechar menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col gap-4 text-lg text-gray-300">
              <Link href="/browse" onClick={() => setMenuOpen(false)} className="hover:text-white">
                Início
              </Link>
              <span className="hover:text-white">Séries</span>
              <span className="hover:text-white">Filmes</span>
              <span className="hover:text-white">Bombando</span>
              <span className="hover:text-white">Minha lista</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
