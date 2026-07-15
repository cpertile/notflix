import { NextRequest, NextResponse } from "next/server";
import { discoverMoviesByGenre, getTrendingMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const genreId = request.nextUrl.searchParams.get("genreId");
  const page = request.nextUrl.searchParams.get("page") ?? "1";
  const kids = request.nextUrl.searchParams.get("kids") === "1";

  try {
    const movies = genreId
      ? await discoverMoviesByGenre(parseInt(genreId, 10), parseInt(page, 10), { kids })
      : await getTrendingMovies(1, { kids });

    return NextResponse.json({ movies });
  } catch {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
