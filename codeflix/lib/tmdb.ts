//codeflix/lib/tmdb.ts
const API_KEY = process.env.TMDB_KEY;
const base = "https://api.themoviedb.org/3";

type TMDBMovie = {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
};

type TMDBListResponse = {
  results: TMDBMovie[];
};

type TMDBReleaseDates = {
  results: Array<{
    iso_3166_1: string;
    release_dates: Array<{
      certification: string;
      note?: string;
      release_date: string;
      type: number;
    }>;
  }>;
};

type TMDBKeywordsResponse = {
  keywords: Array<{ id: number; name: string }>;
};
export async function getFantasyMovies() {
  const res = await fetch(
    `${base}/discover/movie?api_key=${API_KEY}&with_genres=14&language=es-MX&sort_by=popularity.desc`
  );
  const data: TMDBListResponse = await res.json();
  return data.results || [];
}

// Más populares (fantasía)
export async function getFantasyPopular() {
  const res = await fetch(
    `${base}/discover/movie?api_key=${API_KEY}&with_genres=14&language=es-MX&sort_by=popularity.desc`
  );
  const data: TMDBListResponse = await res.json();
  return data.results || [];
}

// Mejor calificadas 
export async function getFantasyTopRated(minVotes = 200) {
  const res = await fetch(
    `${base}/discover/movie?api_key=${API_KEY}&with_genres=14&language=es-MX&sort_by=vote_average.desc&vote_count.gte=${minVotes}`
  );
  const data: TMDBListResponse = await res.json();
  return (data.results || []).filter(m => (m.vote_count || 0) >= minVotes);
}

// Más recientes 
export async function getFantasyLatest({ from }: { from?: string } = {}) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const params = new URLSearchParams({
    api_key: API_KEY!,
    with_genres: "14",
    language: "es-MX",
    sort_by: "primary_release_date.desc",
    "primary_release_date.lte": today,
    include_adult: "false",
    include_video: "false",
    region: "MX", 
  });

  if (from) params.append("primary_release_date.gte", from);

  const res = await fetch(`${base}/discover/movie?${params.toString()}`);
  const data: TMDBListResponse = await res.json();
  const results = data.results || [];

  const safeToday = new Date(today).getTime();
  const filtered = results.filter((m) => {
    const rd = m.release_date;
    if (!rd) return false;
    const time = new Date(rd).getTime();
    return !Number.isNaN(time) && time <= safeToday;
  });

  filtered.sort((a, b) => {
    const ta = new Date(a.release_date || "1970-01-01").getTime();
    const tb = new Date(b.release_date || "1970-01-01").getTime();
    return tb - ta;
  });

  return filtered;
}


// Próximos estrenos 
export async function getFantasyUpcoming() {
  const today = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({
    api_key: API_KEY!,
    with_genres: "14",
    language: "es-MX",
    sort_by: "primary_release_date.asc",
    "primary_release_date.gte": today, 
  });

  const res = await fetch(`${base}/discover/movie?${params.toString()}`);
  const data: TMDBListResponse = await res.json();
  return data.results || [];
}

// Recomendadas 
export async function getRecommendedFantasyByMovieId(id: number) {
  const res = await fetch(`${base}/movie/${id}/recommendations?api_key=${API_KEY}&language=es-MX`);
  const data: TMDBListResponse = await res.json();
  return (data.results || []).filter(m => (m.genre_ids || []).includes(14));
}

export async function getFantasyTrending() {
  const res = await fetch(
    `${base}/trending/movie/week?api_key=${API_KEY}&language=es-MX`
  );
  const data: TMDBListResponse = await res.json();
  return (data.results || []).filter(m => (m.genre_ids || []).includes(14));
}

// Géneros
export async function getGenres() {
  const res = await fetch(`${base}/genre/movie/list?api_key=${API_KEY}&language=es-MX`);
  const data = await res.json();
  return data.genres;
}

// Detalles
export async function getMovieDetails(id: number) {
  const res = await fetch(`${base}/movie/${id}?api_key=${API_KEY}&language=es-MX`);
  return res.json();
}

// Imágenes
export async function getMovieImages(id: number) {
  const res = await fetch(`${base}/movie/${id}/images?api_key=${API_KEY}`);
  const data = await res.json();

  //Devolvemos backdrops de película
  return data.backdrops || [];
}

// Reparto y Director
export async function getMovieCredits(id: number) {
  const res = await fetch(`${base}/movie/${id}/credits?api_key=${API_KEY}&language=es-MX`);
  const data = await res.json();

  return {
    cast: (data.cast || []).slice(0, 10), // Primeros 10 actores
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    director: (data.crew || []).find((person: any) => person.job === 'Director') || null,
  };
}

/**
 * Certificaciones de una película por país (p.ej. MX, US, ES).
 */
export async function getMovieReleaseDates(id: number) {
  const res = await fetch(`${base}/movie/${id}/release_dates?api_key=${API_KEY}`);
  const data: TMDBReleaseDates = await res.json();
  return data?.results || [];
}

/**
 * Palabras clave de la película.
 */
export async function getMovieKeywords(id: number) {
  const res = await fetch(`${base}/movie/${id}/keywords?api_key=${API_KEY}`);
  const data: TMDBKeywordsResponse = await res.json();
  return data?.keywords || [];
}