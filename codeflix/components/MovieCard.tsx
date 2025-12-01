// codeflix/components/MovieCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import type { Movie } from "@/types/codeflix";

// Configuración de fuentes de Google 
import { Cinzel } from 'next/font/google';
const cinzel = Cinzel({ 
    subsets: ['latin'], 
    weight: ['700'] 
});

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

/**
   * MovieCard
   * - Carta con imagen que representa a una película
   * @param movie 
   * @param className 
   */
export default function MovieCard({ movie, className }: MovieCardProps) {
  const displayTitle = movie.title ?? movie.name ?? "Título no disponible";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "/poster-default.png";

  return (
    <Link href={`/movie/${movie.id}`} aria-label={`Ver detalles de ${displayTitle}`}>
      <div className={`pt-2 overflow-visible cursor-pointer transition-transform duration-200 hover:scale-105 ${className ?? ""}`}>
        <div className="relative rounded-lg overflow-hidden shadow-lg shadow-[#00b8c433] border border-[#00b8c4]/30">
          <div className="aspect-[2/3] relative overflow-visible">
            <Image
              src={posterUrl}
              alt={displayTitle}
              fill
              sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
              className="object-cover"
            />
          </div>
        </div>
        <h3 className={`${cinzel.className} mt-2 text-sm text-center font-bold text-[#00ffff] line-clamp-2`}>{displayTitle}</h3>
      </div>
    </Link>
  );
}
