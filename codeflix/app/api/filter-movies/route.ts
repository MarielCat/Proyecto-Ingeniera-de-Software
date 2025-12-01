import { NextResponse } from "next/server";
//codeflix/app/api/filter-movies/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

const API_KEY = process.env.TMDB_KEY || process.env.NEXT_PUBLIC_TMDB_KEY;
const base = "https://api.themoviedb.org/3";

// Mapeo de categorías de fantasía a sub-géneros TMDB
// Puedes ajustar estos IDs según tus necesidades.
const keywordMap: Record<string, number[]> = {
  "Fantasía infantil": [13065, 9715, 9951],   // fairy tale, children's fantasy, family
  "Fantasía oscura": [10183, 1585, 2036],     // dark fantasy, occult, demon
  "Fantasía épica": [207317, 9717, 1965],     // epic fantasy, sword and sorcery, medieval
  "Fantasía urbana": [21063, 9716, 180547],   // urban fantasy, magic, modern
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      categories = [],
      languages = [],
      yearMin,
      yearMax,
      sortBy = "popularity.desc",
      page = 1,
    } = body as {
      categories: string[];
      languages: string[];
      yearMin?: number;
      yearMax?: number;
      sortBy?: string;
      page?: number;
    };

    if (!API_KEY) {
      return NextResponse.json({ error: "Missing TMDB API Key" }, { status: 500 });
    }

    const params = new URLSearchParams({
      api_key: API_KEY!,
      with_genres: "14", // nuestro genero asignado: fantasía
      language: "es-MX",
      include_adult: "false",
      include_video: "false",
      sort_by: sortBy,
      page: String(page),
    });

    // Rango de fechas 
    if (yearMin) params.set("primary_release_date.gte", `${yearMin}-01-01`);
    if (yearMax) params.set("primary_release_date.lte", `${yearMax}-12-31`);

    // Idiomas originales
    if (languages.length === 1) {
      params.set("with_original_language", languages[0]);
    } else if (languages.length > 1) {
      // No admite múltiples directamente, así que hacemos fetch paralelo y unimos resultados
      const queries = languages.map((lng) => {
        const p = new URLSearchParams(params);
        p.set("with_original_language", lng);
        return fetch(`${base}/discover/movie?${p.toString()}`).then((r) => r.json()).catch(() => ({ results: [] }));
      });
      const results = await Promise.all(queries);
      const merged = results.flatMap((d) => d.results || []);
      // Filtramos solo fantasía 
      const filtered = merged.filter((m: any) => (m.genre_ids || []).includes(14));
      return NextResponse.json({ results: filtered });
    }

    // Keywords por categorías (OR entre categorías, AND con género Fantasía)
    const keywordIds = categories.flatMap((c) => keywordMap[c] || []);
    if (keywordIds.length > 0) {
      params.set("with_keywords", keywordIds.join("|")); // OR lógico entre keywords
    }

    const url = `${base}/discover/movie?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json({
      results: (data.results || []).filter((m: any) => (m.genre_ids || []).includes(14)),
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (err) {
    return NextResponse.json({ error: "Bad Request", detail: String(err) }, { status: 400 });
  }
}