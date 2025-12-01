import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;
const API_KEY = process.env.TMDB_KEY;
const base = "https://api.themoviedb.org/3";

function getUserIdFromRequest(request: Request): number | null {
  const token = request.cookies.get("codeflix_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

async function getRecommendationsForIds(ids: number[]) {
  const promises = ids.map((id) =>
    fetch(`${base}/movie/${id}/recommendations?api_key=${API_KEY}&language=es-MX`)
      .then((r) => r.json())
      .then((d) => (d.results || []).filter((m: any) => (m.genre_ids || []).includes(14)))
      .catch(() => [])
  );
  const results = await Promise.all(promises);
  return results.flat();
}

async function searchFantasyByQueries(queries: string[]) {
  const unique = Array.from(new Set(queries.map((q) => q.trim()).filter(Boolean)));
  const promises = unique.map((q) =>
    fetch(`${base}/search/movie?api_key=${API_KEY}&language=es-MX&query=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => (d.results || []).filter((m: any) => (m.genre_ids || []).includes(14)))
      .catch(() => [])
  );
  const results = await Promise.all(promises);
  return results.flat();
}

export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request);
  
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    // 🔥 Obtener clicks del usuario desde la DB
    const clicks = await prisma.userClick.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    // 🔥 Obtener búsquedas del usuario desde la DB
    const searches = await prisma.userSearch.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    const clickIds = clicks.map(c => c.movieId);
    const queries = searches.map(s => s.query);

    const [byClicks, bySearches] = await Promise.all([
      clickIds.length ? getRecommendationsForIds(clickIds) : Promise.resolve([]),
      queries.length ? searchFantasyByQueries(queries) : Promise.resolve([]),
    ]);

    const map = new Map<number, any>();
    const pushUnique = (arr: any[], weight: number) => {
      for (const m of arr) {
        const id = m.id;
        const prev = map.get(id);
        const score = (m.popularity || 0) + (m.vote_average || 0) * 2 + weight;
        if (!prev || score > prev.__score) {
          map.set(id, { ...m, __score: score });
        }
      }
    };

    pushUnique(byClicks, 10);
    pushUnique(bySearches, 5);

    let merged = Array.from(map.values());
    merged.sort((a, b) => (b.__score || 0) - (a.__score || 0));
    merged = merged.slice(0, 20);

    if (merged.length === 0) {
      const res = await fetch(`${base}/trending/movie/week?api_key=${API_KEY}&language=es-MX`);
      const data = await res.json();
      const trending = (data.results || []).filter((m: any) => (m.genre_ids || []).includes(14));
      merged = trending.slice(0, 20);
    }

    return NextResponse.json({ items: merged });
  } catch (error) {
    console.error("Error en recomendaciones:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}