// codeflix/hooks/usePersonalizedReco.ts
"use client";
import { useEffect, useState } from "react";
import { getClicks, getSearches } from "@/lib/reco";
import { getRecommendationsForIds, searchFantasyByQueries } from "@/lib/tmdb-client";
import { getFantasyTrending } from "@/lib/tmdb"; // servidor, puedes envolver en una API si prefieres

export default function usePersonalizedReco() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function build() {
      setLoading(true);
      try {
        const clicks = getClicks(8);
        const searches = getSearches(5);

        const clickIds = clicks.map((c) => c.movieId);
        const queries = searches.map((s) => s.query);

        const [byClicks, bySearches] = await Promise.all([
          clickIds.length ? getRecommendationsForIds(clickIds) : Promise.resolve([]),
          queries.length ? searchFantasyByQueries(queries) : Promise.resolve([]),
        ]);

        // Mezclar, deduplicar, ordenar
        const map = new Map<number, any>();
        const pushUnique = (arr: any[], weight: number) => {
          for (const m of arr) {
            const id = m.id;
            const prev = map.get(id);
            const score =
              (m.popularity || 0) +
              (m.vote_average || 0) * 2 +
              weight;
            if (!prev || score > prev.__score) {
              map.set(id, { ...m, __score: score });
            }
          }
        };

        pushUnique(byClicks, 10);    // más peso por recomendaciones directas
        pushUnique(bySearches, 5);   // algo menos por búsquedas

        let merged = Array.from(map.values());
        merged.sort((a, b) => (b.__score || 0) - (a.__score || 0));
        merged = merged.slice(0, 20);

        // Fallback si vacío
        if (merged.length === 0) {
          try {
            const trending = await getFantasyTrending();
            merged = trending.slice(0, 20);
          } catch {}
        }

        if (mounted) setItems(merged);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    build();
    return () => {
      mounted = false;
    };
  }, []);

  return { items, loading };
}
