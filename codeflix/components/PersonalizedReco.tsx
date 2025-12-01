// components/PersonalizedReco.tsx - REEMPLAZAR TODO
"use client";
import React from "react";
import Carousel from "@/components/Carousel";

export default function PersonalizedReco() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;

    async function fetchReco() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/reco"); // 👈 Ahora es GET, no POST
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        
        const data = await res.json();
        
        if (mounted) {
          setItems(Array.isArray(data?.items) ? data.items : []);
        }
      } catch (e: any) {
        console.error("[Reco] error:", e);
        if (mounted) setError(e?.message ?? "Error cargando recomendaciones");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchReco();
    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  // Escuchar cambios
  React.useEffect(() => {
    const handleUpdate = () => {
      console.log("[Reco] Actualizando recomendaciones...");
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener("recoUpdated", handleUpdate);
    
    return () => {
      window.removeEventListener("recoUpdated", handleUpdate);
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
        <p className="text-sm text-red-400">⚠️ Error: {error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#00b8c4]/10 border border-[#00b8c4]/30 rounded-lg p-6 text-center">
        <p className="text-[#b2ecef]">
          ✨ Empieza a explorar películas para recibir recomendaciones personalizadas
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