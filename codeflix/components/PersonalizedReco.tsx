// codeflix/components/PersonalizedReco.tsx
"use client";
import React from "react";
import Carousel from "@/components/Carousel";
import { getClicks, getSearches } from "@/lib/reco";

// Si por ahora no tienes tmdb-client ni endpoint,
// usa un fetch a tu propio API (recomendado) o comenta y muestra mock.
async function fetchRecoFromServer(clickIds: number[], queries: string[]) {
  // Recomendado: crea /app/api/reco/route.ts que use TMDB (server) y devuelva mezclado.
  // Aquí ejemplo de llamada. Ajusta la ruta según tu estructura.
  const res = await fetch("/api/reco", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clickIds, queries }),
  });
  if (!res.ok) {
    console.warn("Reco API error:", res.status);
    return [];
  }
  const data = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}

export default function PersonalizedReco() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function build() {
      setLoading(true);
      setError(null);

      try {
        const clicks = getClicks(8);
        const searches = getSearches(5);

        console.log("[Reco] clicks:", clicks);
        console.log("[Reco] searches:", searches);

        const clickIds = clicks.map((c) => c.movieId);
        const queries = searches.map((s) => s.query);

        // Si no tienes el endpoint aún, como prueba, usa fallback de trending desde servidor:
        // const trending = await getFantasyTrending(); // no disponible en cliente directamente
        // setItems(trending.slice(0, 20));
        // return;

        const reco = await fetchRecoFromServer(clickIds, queries);
        console.log("[Reco] resultado API:", reco);

        if (mounted) {
          setItems(reco);
        }
      } catch (e: any) {
        console.error("[Reco] error:", e);
        if (mounted) setError(e?.message ?? "Error construyendo recomendaciones");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    build();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-[#00a4ad] mb-4">Podría gustarte…</h2>

      {loading && (
        <p className="text-sm text-[#b2ecef]">Cargando recomendaciones…</p>
      )}

      {error && (
        <p className="text-sm text-red-400">Error: {error}</p>
      )}

      {/* Muestra el conteo para confirmar visualmente */}
      {!loading && !error && (
        <p className="text-xs text-[#b2ecef]/70 mb-2">
          {items.length ? `Encontradas ${items.length} recomendaciones.` : "Sin recomendaciones por ahora."}
        </p>
      )}

      {/* Renderiza el Carousel solo si hay items */}
      {items.length > 0 ? (
        <Carousel title="" items={items} speed={1.5} />
      ) : null}
    </section>
  );
}
