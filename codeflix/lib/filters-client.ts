export type FilterPayload = {
    categories: string[];
    languages: string[];
    yearMin?: number;
    yearMax?: number;
    sortBy?: string;
    page?: number;
  };
  
  export async function fetchFilteredMovies(payload: FilterPayload) {
    const res = await fetch("/api/filter-movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }
    return res.json();
  }