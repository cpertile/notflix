import { NextResponse } from "next/server";
import { getTrendingMovies } from "@/lib/tmdb";

export async function GET() {
  try {
    const movies = await getTrendingMovies();
    return NextResponse.json({ movies });
  } catch {
    return NextResponse.json({ error: "Failed to fetch trending movies" }, { status: 500 });
  }
}
