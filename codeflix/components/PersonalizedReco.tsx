/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Carousel from "@/components/Carousel";

/**
 * Componente `PersonalizedReco`
 * - Obtiene y muestra recomendaciones personalizadas del endpoint interno `/api/reco`.
 * - Renderiza un carrusel con las ítems recomendadas cuando la carga es exitosa.
 * - Muestra estados de carga, error y vacío con mensajes claros.
*/
export default function PersonalizedReco() {
  /**
   * Estado local:
   * - items: lista de recomendaciones.
   * - loading: indicador de carga mientras se consulta la API.
   * - error: mensaje de error (si algo falla).
   * - refreshKey: clave que al cambiar fuerza la recarga del efecto de recomendaciones.
   */
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  /**
   * Efecto de carga de recomendaciones:
   * - Llama a `/api/reco`.
   * - Controla estados de carga y error.
   * - Usa `mounted` para evitar `setState` cuando el componente ya no está montado.
   */
  React.useEffect(() => {
    let mounted = true;

    async function fetchReco() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/reco"); 
        
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

  /**
   * Efecto para escuchar actualizaciones externas:
   * - Escucha el evento `recoUpdated` en `window` y aumenta `refreshKey` para recargar la data.
   * - Ejemplo de disparo: `window.dispatchEvent(new Event("recoUpdated"))`
   */
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

  // Estado de carga
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

  // Estado de error
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-sm text-red-400">⚠️ Error: {error}</p>
      </div>
    );
  }

  // Estado vacío (sin recomendaciones)
  if (items.length === 0) {
    return (
      <div className="bg-[#00b8c4]/10 border border-[#00b8c4]/30 rounded-lg p-6 text-center">
        <p className="text-[#b2ecef]">
          Empieza a explorar películas para recibir recomendaciones personalizadas
        </p>
      </div>
    );
  }

  /**
   * Render principal:
   * - Carrusel horizontal con las recomendaciones. Sin título, velocidad 1.5 para dinamismo.
   */
  return (
    <section className="mt-4 mb-0 pb-0">
      <Carousel title="" items={items} speed={1.5} />
    </section>
  );
}