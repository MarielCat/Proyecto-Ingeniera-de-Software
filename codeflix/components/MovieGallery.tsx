// components/MovieGallery.tsx
'use client';
import HorizontalList from '@/components/HorizontalList';
import type { MovieImage } from "@/types/codeflix";

interface Props {
  images: MovieImage[];
  title?: string;
}

export default function MovieGallery({ images, title }: Props) {
  if (!images || images.length === 0) return <p>No hay imágenes disponibles.</p>;

  return (
    <HorizontalList className="gap-4">
      {images.slice(0, 10).map((img, index) => (
        <div key={index} className="flex-shrink-0 w-80">
          <img
            src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
            className="rounded-lg shadow-md hover:scale-105 transition-transform border border-[#00b8c455]"
            draggable={false}
            alt={title ?? `Image ${index + 1}`}
          />
        </div>
      ))}
    </HorizontalList>
  );
}