import { NextRequest, NextResponse } from "next/server";
import { getTrendingMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10);
  const kids = request.nextUrl.searchParams.get("kids") === "1";

  try {
    const movies = await getTrendingMovies(page, { kids });
    return NextResponse.json({ movies });
  } catch {
    return NextResponse.json({ error: "Failed to fetch trending movies" }, { status: 500 });
  }
}
