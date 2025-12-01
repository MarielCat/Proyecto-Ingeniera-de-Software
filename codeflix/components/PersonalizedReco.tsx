// codeflix/components/PersonalizedReco.tsx
"use client";
import React from "react";
import Carousel from "@/components/Carousel";
import { getClicks, getSearches } from "@/lib/reco";

async function fetchRecoFromServer(clickIds: number[], queries: string[]) {
  try {
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
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b8c4]"></div>
          <p className="text-sm text-[#b2ecef]">Cargando tus recomendaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-sm text-red-400">❌ Error: {error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#00b8c4]/10 border border-[#00b8c4]/30 rounded-lg p-6 text-center">
        <p className="text-[#b2ecef]">
          Empieza a explorar películas para recibir recomendaciones personalizadas
        </p>
      </div>
    );
  }

  return (
    <section className="mt-4">
      <Carousel title="" items={items} speed={1.5} />
    </section>
  );
}