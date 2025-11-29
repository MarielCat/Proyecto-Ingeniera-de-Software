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

// Configuración de fuentes de Google 
import { Lora } from 'next/font/google';
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

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

  const localBackgroundImage = "/purple-magic-sparkling-shining-stars.png";

  // Imagen con un overlay negro para legibilidad
  const backgroundStyle = `
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('${localBackgroundImage}')
  `;

return (
    <>
      {/* Contenedor con fondo */}
      <div 
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          backgroundImage: backgroundStyle,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Secciones */}
      <main className="px-6 max-w-7xl mx-auto py-8">
        <Carousel title="Más populares" items={populares} />
        <Carousel title="Más recientes" items={recientes} />
        <Carousel title="Mejor calificadas" items={topRated} />
        <Carousel title="Próximos estrenos" items={proximos} />
        <Carousel title="Recomendadas" items={recomendadas} />

        <h2 className={`${lora.className} text-2xl font-bold text-[#00a4ad] mb-4`}>Géneros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pb-10">
          {Array.isArray(genres) &&
            genres.map((g) => (
              <div
                key={g.id}
                className="bg-[#00b8c41a] border border-[#00b8c4] text-[#e7fafa] rounded-lg px-3 py-2 text-center text-sm backdrop-blur-sm"
              >
                {g.name}
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
