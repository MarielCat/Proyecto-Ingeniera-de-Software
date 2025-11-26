// components/MovieGallery.tsx
'use client';
import { useRef, useEffect } from 'react';

interface ImageItem {
  file_path: string;
}

interface Props {
  images: ImageItem[];
  title?: string;
}

export default function MovieGallery({ images, title }: Props) {
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const containerEl = scrollContainer.current;
    if (!containerEl) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      e.preventDefault();
      velocityRef.current = e.deltaY * 0.1;

      // Inicia la animación si no está corriendo
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Animación suave continua
    const animate = () => {
      if (Math.abs(velocityRef.current) > 0.1) {
        containerEl.scrollLeft += velocityRef.current;
        velocityRef.current *= 0.95; // Desaceleración gradual
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        velocityRef.current = 0;
        animationFrameRef.current = null;
      }
    };

    // { passive: false } permite usar preventDefault()
    containerEl.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      containerEl.removeEventListener('wheel', onWheel);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!images || images.length === 0) return <p>No hay imágenes disponibles.</p>;

  return (
    <div
      ref={scrollContainer}
      className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
    >
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
    </div>
  );
}