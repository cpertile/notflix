import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const movies = await searchMovies(query);
    return NextResponse.json({ movies });
  } catch {
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}
