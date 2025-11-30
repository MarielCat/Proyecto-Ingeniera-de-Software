// codeflix/lib/reco.ts
const CLICKS_KEY = "cf_clicks";
const SEARCHES_KEY = "cf_searches";

export type UserClick = {
  movieId: number;
  genreIds?: number[];
  ts: number;
};

export type UserSearch = {
  query: string;
  ts: number;
};

const MAX_ITEMS = 50;

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function addClick(click: UserClick) {
  const list: UserClick[] = loadJSON<UserClick[]>(CLICKS_KEY, []);
  const updated = [click, ...list].slice(0, MAX_ITEMS);
  saveJSON(CLICKS_KEY, updated);
}

export function addSearch(search: UserSearch) {
  const list: UserSearch[] = loadJSON<UserSearch[]>(SEARCHES_KEY, []);
  const updated = [search, ...list].slice(0, MAX_ITEMS);
  saveJSON(SEARCHES_KEY, updated);
}

export function getClicks(limit = 10): UserClick[] {
  const list: UserClick[] = loadJSON<UserClick[]>(CLICKS_KEY, []);
  return list.slice(0, limit);
}

export function getSearches(limit = 5): UserSearch[] {
  const list: UserSearch[] = loadJSON<UserSearch[]>(SEARCHES_KEY, []);
  return list.slice(0, limit);
}

export function clearSignals() {
  saveJSON(CLICKS_KEY, []);
  saveJSON(SEARCHES_KEY, []);
}
