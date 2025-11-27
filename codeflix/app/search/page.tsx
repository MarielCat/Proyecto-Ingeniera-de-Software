// codeflix/app/search/page.tsx
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params.query ?? "";
  const apiKey = process.env.TMDB_KEY;

  if (!query.trim()) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Realiza una búsqueda</h2>
        <p className="text-gray-600">Escribe el nombre de una película o serie en la barra superior.</p>
      </div>
    );
  }

  //Llamada a TMDB
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-MX&query=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json();

  const results = data.results || [];

  return (
    <div className="px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-6">
        Resultados para: <span className="text-[#007f88]">«{query}»</span>
      </h1>

      {results.length === 0 && (
        <p className="text-lg text-gray-500">Sin resultados</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

