// lib/reco.ts - REEMPLAZAR TODO EL CONTENIDO

export async function addClick(movieId: number) {
  if (typeof window === "undefined") return;
  
  try {
    await fetch("/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "click", movieId })
    });
    
    // Notificar que hubo cambio para refrescar recomendaciones
    window.dispatchEvent(new Event("recoUpdated"));
  } catch (error) {
    console.error("Error guardando click:", error);
  }
}

export async function addSearch(query: string) {
  if (typeof window === "undefined") return;
  
  try {
    await fetch("/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "search", query })
    });
    
    // Notificar que hubo cambio para refrescar recomendaciones
    window.dispatchEvent(new Event("recoUpdated"));
  } catch (error) {
    console.error("Error guardando búsqueda:", error);
  }
}

// Ya NO se necesitan getClicks() ni getSearches()
// porque ahora el backend los obtiene de la DB