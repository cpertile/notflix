import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const kids = request.nextUrl.searchParams.get("kids") === "1";

  try {
    const movies = await searchMovies(query, { kids });
    return NextResponse.json({ movies });
  } catch {
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}
