// codeflix/app/search/page.tsx
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

/**
 * Propiedadess para la página de búsqueda.
 */
type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Página de Resultados de Búsqueda .
 * - Recibe un término de búsqueda.
 * - Consulta la API de TMDB filtrando específicamente por películas de FANTASÍA.
 * - Renderiza los resultados o un mensaje si no hay.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Parámetros de búsqueda 
  const params = await searchParams;
  const query = typeof params.query === 'string' ? params.query : "";
  const apiKey = process.env.TMDB_KEY;

  // Si no hay texto, indicamos ingresarlo
  if (!query.trim()) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Realiza una búsqueda</h2>
        <p className="text-gray-600">Escribe el nombre de una película o serie en la barra superior.</p>
      </div>
    );
  }

  // 'with_genres=14' filtra a sólo resultados de categoría Fantasía
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-MX&with_genres=14&query=${encodeURIComponent(query)}`;

  // Mantiene los resultados en caché por 60 segundos para optimizar rendimiento
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json();

  const results = data.results || [];

  return (
    <div className="px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-6">
        Resultados para: <span className="text-[#007f88]">«{query}»</span>
      </h1>

      {/* Búsqueda sin coincidencias */}
      {results.length === 0 && (
        <p className="text-lg text-gray-500">Sin resultados en la categoría de fantasía.</p>
      )}

      {/* Muestra la lista de tarjetas de películas resultantes*/}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {results.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
