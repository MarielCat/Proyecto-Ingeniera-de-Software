// codeflix/app/page.tsx (Home)
import Carousel from "@/components/Carousel";
import { addClick } from "@/lib/reco";
import PersonalizedReco from "@/components/PersonalizedReco";

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

  const handleItemClick = (item) => {
    addClick({
      movieId: item.id,
      genreIds: item.genre_ids,
      ts: Date.now(),
    });
  };

  return (
    <main className="px-6 max-w-7xl mx-auto">
      <PersonalizedReco />
      <Carousel title="Más populares" items={populares} speed={1.6} />
      <Carousel title="Más recientes" items={recientes} speed={1.8} />
      <Carousel title="Mejor calificadas" items={topRated} speed={1.4} />
      <Carousel title="Próximos estrenos" items={proximos} speed={1.7} />
      <Carousel title="Recomendadas" items={recomendadas} speed={1.5} />

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
