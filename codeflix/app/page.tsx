import Carousel from "@/components/Carousel";
import {
  getFantasyPopular,
  getFantasyTopRated,
  getFantasyLatest,
  getFantasyUpcoming,
  getFantasyTrending,
  getRecommendedFantasyByMovieId,
  getGenres,
} from "@/lib/tmdb";

/**
 * Página principal de la aplicación.
 * * @returns {JSX.Element} La estructura principal de la Home con múltiples carruseles.
 */
export default async function Home() {
  const [
    populares,
    topRated,
    recientes,
    proximos,
    trendingFallback,
    genres,
    recomendadasSeed,
  ] = await Promise.all([
    getFantasyPopular(),
    getFantasyTopRated(200),
    getFantasyLatest(),
    getFantasyUpcoming(),
    getFantasyTrending(),
    getGenres(),
    getRecommendedFantasyByMovieId(120),
  ]);

  // Si no hay recomendaciones específicas para usuario, usamos tendencias generales
  const recomendadas = recomendadasSeed?.length ? recomendadasSeed : trendingFallback;

  return (
    <main className="px-6 max-w-7xl mx-auto ">
      <Carousel title="Más populares" items={populares} />
      <Carousel title="Más recientes" items={recientes} />
      <Carousel title="Mejor calificadas" items={topRated} />
      <Carousel title="Próximos estrenos" items={proximos} />
      <Carousel title="Recomendadas" items={recomendadas} />

      <h2 className="text-xl font-bold text-[#00a4ad] mt-10 mb-4">Géneros</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.isArray(genres) &&
          genres.map((g) => (
            <div
              key={g.id}
              className="bg-[#00b8c41a] border border-[#00b8c4] text-[#e7fafa] rounded-lg px-3 py-2 text-center text-sm"
            >
              {g.name}
            </div>
          ))}
      </div>
    </main>
  );
}
