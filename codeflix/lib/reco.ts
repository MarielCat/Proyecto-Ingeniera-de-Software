export async function addClick(movieId: number) {
  if (typeof window === "undefined") return;
  
  try {
    await fetch("/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "click", movieId })
    });
    
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
    
    window.dispatchEvent(new Event("recoUpdated"));
  } catch (error) {
    console.error("Error guardando búsqueda:", error);
  }
}
