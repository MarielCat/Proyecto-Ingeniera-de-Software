/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  getMovieDetails, 
  getMovieImages, 
  getMovieCredits,
  getMovieReleaseDates,
  getMovieKeywords} from "@/lib/tmdb";
import MovieGallery from "@/components/MovieGallery";
import CastCrew from "@/components/CastCrew";

/**
 * Extrae la certificación preferida de las fechas de lanzamiento por país.
 * Prioriza: MX -> ES -> US -> cualquier otra con certificación.
 */
function getPreferredCertification(releaseDates: Array<{ iso_3166_1: string; release_dates: any[] }>) {
  const pick = (cc: string) => {
    const entry = releaseDates.find(r => r.iso_3166_1 === cc);
    if (!entry) return null;
    const withCert = (entry.release_dates || []).find((x: any) => x.certification && x.certification.trim().length > 0);
    return withCert?.certification || null;
  };
  return pick("MX") || pick("ES") || pick("US") || null;
}


/**
 * Configuración de fuentes de Google 
 * Elegimos Cinzel' para títulos con estética de fantasía y 'Lora' para textos largos.
 */
import { Cinzel } from 'next/font/google';
const cinzel = Cinzel({ 
    subsets: ['latin'], 
    weight: ['700'] 
});

import { Lora } from 'next/font/google';
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});


/**
 * Página una Película con sus detalles
 * - Realiza 3 peticiones: Detalles, Imágenes, Cast&Crew.
 * - Renderiza una imagen de la película como fondo.
 */
export default async function MoviePage({ params }: { params: { id: string } }) {
  const { id } = await params; 
  const idNum = Number(id);
  const movieId = Number.isFinite(idNum) ? idNum : id; 

  
  // Info necesaria
  const [movie, images, credits, relDates, keywords] = await Promise.all([
    getMovieDetails(movieId as any),
    getMovieImages(movieId as any),
    getMovieCredits(movieId as any),
    getMovieReleaseDates(movieId as any),
    getMovieKeywords(movieId as any),
  ]);

  // Usaremos la primera imagen como fondo y las demás estarán en la galería
  const backgroundImage = images && images.length > 0 ? images[0].file_path : null;
  
  // Separamos el resto de imágenes para no repetir la del fondo en la galería
  const remainingImages = images && images.length > 1 ? images.slice(1) : images;

  const backgroundStyle = backgroundImage 
    ? `url(https://image.tmdb.org/t/p/original${backgroundImage})`
    : 'none';
    // Derivados para la ficha técnica
  const certification = getPreferredCertification(relDates);
  const releaseYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : null;
  const runtimeMin = movie?.runtime; // en minutos
  const runtimeText = typeof runtimeMin === "number" ? `${Math.floor(runtimeMin / 60)}h ${runtimeMin % 60}m` : null;
  const originalLang = movie?.original_language?.toUpperCase?.();
  const genres = Array.isArray(movie?.genres) ? movie.genres.map((g: any) => g.name) : [];
  const subgenres = Array.isArray(keywords) ? keywords.map(k => k.name) : [];

  return (
    
    <div // Imagen de película de fondo
      className="w-screen min-h-full bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: backgroundStyle,
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      {/* Overlay de imagen de fondo para legibilidad */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 px-6 pb-10 max-w-3xl mx-auto pt-[20vh]">
        {/*Título y descripción */}
        <h1 className={`${cinzel.className} text-4xl font-bold text-[#3bccd4]`}>{movie.title}</h1>
        <p className="mt-4 text-[#b2ecef]">{movie.overview}</p>

        {/* Ficha técnica: chips con metadatos clave */}
        <div className="mt-5 flex flex-wrap gap-2">
          {releaseYear && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#e0fafa]/80 border border-[#a8e4e8] text-[#004b4b]">
              Año: {releaseYear}
            </span>
          )}
          {certification && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#e0fafa]/80 border border-[#a8e4e8] text-[#004b4b]">
              Certificación: {certification}
            </span>
          )}
          {runtimeText && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#e0fafa]/80 border border-[#a8e4e8] text-[#004b4b]">
              Duración: {runtimeText}
            </span>
          )}
          {originalLang && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#e0fafa]/80 border border-[#a8e4e8] text-[#004b4b]">
              Idioma original: {originalLang}
            </span>
          )}

          {/* Géneros principales */}
          {genres.map((g: string) => (
            <span
              key={`genre-${g}`}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#00b8c4] text-white shadow-md shadow-cyan-500/30"
            >
              {g}
            </span>
          ))}

          {/* Subgéneros o tambien llamados keywords (limitamos para no saturar) */}
          {subgenres.slice(0, 6).map((k) => (
            <span
              key={`kw-${k}`}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 border border-[#bdebed] text-[#004b4b]"
              title="Subgénero / keyword TMDB"
            >
              {k}
            </span>
          ))}
        </div>

        <br />
        <br />


        {/*Galería de imágenes */}
        <h2 className={`${cinzel.className} text-2xl font-bold text-[#3bccd4] mb-4`}>
          Galería
        </h2>
        {/* Contenedor con scroll horizontal */}
        <MovieGallery images={remainingImages} title={movie.title} />
        <br></br>

        {/*Reparto y equipo*/}
        <h2 className={`${cinzel.className} text-2xl font-bold text-[#3bccd4] mb-4`}>
          Reparto y Equipo
        </h2>
        <CastCrew cast={credits.cast} director={credits.director} />

      </div>
    </div>
  );
}
