// codeflix/lib/reco.ts
export async function addClick(movieId: number): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!Number.isFinite(movieId) || movieId <= 0) return false;

  try {
    const res = await fetch("/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "click", movieId }),
    });

    if (!res.ok) {
      console.warn("Signal click failed:", res.status);
      return false;
    }

    window.dispatchEvent(new Event("recoUpdated"));
    return true;
  } catch (error) {
    console.error("Error guardando click:", error);
    return false;
  }
}

export async function addSearch(rawQuery: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const query = (rawQuery ?? "").trim();
  if (query.length < 2) return false;

  try {
    const res = await fetch("/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "search", query }),
    });

    if (!res.ok) {
      console.warn("Signal search failed:", res.status);
      return false;
    }

    window.dispatchEvent(new Event("recoUpdated"));
    return true;
  } catch (error) {
    console.error("Error guardando búsqueda:", error);
    return false;
  }
}
