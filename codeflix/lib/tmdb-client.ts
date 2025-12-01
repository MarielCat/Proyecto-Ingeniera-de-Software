// codeflix/lib/tmdb-client.ts

const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY || process.env.TMDB_KEY; 
const base = "https://api.themoviedb.org/3";

export async function getRecommendationsForIds(ids: number[]) {
  const promises = ids.map((id) =>
    fetch(`${base}/movie/${id}/recommendations?api_key=${API_KEY}&language=es-MX`)
      .then((r) => r.json())
      .then((d) => (d.results || []).filter((m) => (m.genre_ids || []).includes(14)))
      .catch(() => [])
  );
  const results = await Promise.all(promises);
  return results.flat();
}

export async function searchFantasyByQueries(queries: string[]) {
  const unique = Array.from(new Set(queries.map((q) => q.trim()).filter(Boolean)));
  const promises = unique.map((q) =>
    fetch(`${base}/search/movie?api_key=${API_KEY}&language=es-MX&query=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => (d.results || []).filter((m) => (m.genre_ids || []).includes(14)))
      .catch(() => [])
  );
  const results = await Promise.all(promises);
  return results.flat();
}
