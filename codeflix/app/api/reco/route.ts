import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;
const API_KEY = process.env.TMDB_KEY as string;
const base = "https://api.themoviedb.org/3";

interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
  popularity?: number;
  vote_average?: number;
  [key: string]: unknown;
}

interface TmdbResults<T> {
  page?: number;
  results?: T[];
  total_pages?: number;
  total_results?: number;
}

function getUserIdFromRequest(request: NextRequest): number | null {
  const token = request.cookies.get("codeflix_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

async function getRecommendationsForIds(ids: number[]): Promise<TmdbMovie[]> {
  const promises = ids.map(async (id) => {
    try {
      const r = await fetch(
        `${base}/movie/${id}/recommendations?api_key=${API_KEY}&language=es-MX`,
        { next: { revalidate: 60 } }
      );
      const d: TmdbResults<TmdbMovie> = await r.json();
      const results = d.results ?? [];
      return results.filter((m) => (m.genre_ids ?? []).includes(14));
    } catch {
      return [] as TmdbMovie[];
    }
  });
  const results = await Promise.all(promises);
  return results.flat();
}

async function searchFantasyByQueries(queries: string[]): Promise<TmdbMovie[]> {
  const unique = Array.from(new Set(queries.map((q) => q.trim()).filter(Boolean)));
  const promises = unique.map(async (q) => {
    try {
      const r = await fetch(
        `${base}/search/movie?api_key=${API_KEY}&language=es-MX&query=${encodeURIComponent(q)}`,
        { next: { revalidate: 60 } }
      );
      const d: TmdbResults<TmdbMovie> = await r.json();
      const results = d.results ?? [];
      return results.filter((m) => (m.genre_ids ?? []).includes(14));
    } catch {
      return [] as TmdbMovie[];
    }
  });
  const results = await Promise.all(promises);
  return results.flat();
}

type ScoredMovie = TmdbMovie & { __score: number };

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const clicks = await prisma.userClick.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 10,
      select: { movieId: true },
    });

    const searches = await prisma.userSearch.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 10,
      select: { query: true },
    });

    const clickIds: number[] = clicks.map((c: { movieId: number }) => c.movieId);
    const queries: string[] = searches.map((s: { query: string }) => s.query);

    const [byClicks, bySearches] = await Promise.all([
      clickIds.length ? getRecommendationsForIds(clickIds) : Promise.resolve([] as TmdbMovie[]),
      queries.length ? searchFantasyByQueries(queries) : Promise.resolve([] as TmdbMovie[]),
    ]);

    const map = new Map<number, ScoredMovie>();

    const pushUnique = (arr: TmdbMovie[], weight: number): void => {
      for (const m of arr) {
        const id = m.id;
        const prev = map.get(id);
        const score = (m.popularity ?? 0) + (m.vote_average ?? 0) * 2 + weight;
        if (!prev || score > prev.__score) {
          map.set(id, { ...m, __score: score });
        }
      }
    };

    pushUnique(byClicks, 10);
    pushUnique(bySearches, 5);

    let merged: ScoredMovie[] = Array.from(map.values());
    merged.sort((a, b) => (b.__score ?? 0) - (a.__score ?? 0));
    merged = merged.slice(0, 20);

    if (merged.length === 0) {
      const res = await fetch(
        `${base}/trending/movie/week?api_key=${API_KEY}&language=es-MX`,
        { next: { revalidate: 60 } }
      );
      const data: TmdbResults<TmdbMovie> = await res.json();
      const trending = (data.results ?? []).filter((m) => (m.genre_ids ?? []).includes(14));
      merged = trending.slice(0, 20).map((m) => ({
        ...m,
        __score: (m.popularity ?? 0) + (m.vote_average ?? 0) * 2,
      }));
    }

    const items: TmdbMovie[] = merged.map(({ __score, ...rest }) => rest);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error en recomendaciones:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
