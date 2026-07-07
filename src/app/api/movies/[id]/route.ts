import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails } from "@/lib/tmdb";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const movie = await getMovieDetails(parseInt(id, 10));
    return NextResponse.json({ movie });
  } catch {
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 });
  }
}
