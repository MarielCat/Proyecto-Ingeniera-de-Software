import { getMovieDetails, getMovieImages, getMovieCredits } from "@/lib/tmdb";
import MovieGallery from "@/components/MovieGallery";
import CastCrew from "@/components/CastCrew";

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
export default async function MoviePage({ params }) {
  const { id } = await params; 
  
  // Info necesaria
  const [movie, images, credits] = await Promise.all([
    getMovieDetails(id),
    getMovieImages(id),
    getMovieCredits(id),
  ]);

  // Usaremos la primera imagen como fondo y las demás estarán en la galería
  const backgroundImage = images && images.length > 0 ? images[0].file_path : null;
  
  // Separamos el resto de imágenes para no repetir la del fondo en la galería
  const remainingImages = images && images.length > 1 ? images.slice(1) : images;

  const backgroundStyle = backgroundImage 
    ? `url(https://image.tmdb.org/t/p/original${backgroundImage})`
    : 'none';

  return (
    
    <div // Imagen de película de fondo
      className="w-screen min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: backgroundStyle,
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      {/* Overlay de imagen de fondo para legibilidad */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 px-6 py-10 max-w-3xl mx-auto mt-4">
        {/*Título y descripción */}
        <h1 className={`${cinzel.className} text-4xl font-bold text-[#3bccd4]`}>{movie.title}</h1>
        <p className="mt-4 text-[#b2ecef]">{movie.overview}</p>

        <br></br>
        <br></br>

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
