import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.TMDB_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-MX&with_genres=14&query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json({ results: data.results?.slice(0, 6) || [] });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}