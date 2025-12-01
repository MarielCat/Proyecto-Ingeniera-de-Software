// codeflix/components/Carousel.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import MovieCard from "@/components/MovieCard";
import type { Movie } from "@/types/codeflix";

// Configuración de fuentes de Google 
import { Lora } from 'next/font/google';
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

/**
 * Propiedades para Carousel.
 * @property {string} title - Título de la sección correspondiente al carrusel.
 * @property {any[]} items - Lista de películas (TMDBMovie[]).
 * @property {number} [speed] - Velocidad de desplazamiento automático (pixeles/frame).
 * @property {number} [interval] - Intervalo de actualización en ms.
 */
type CarouselProps = {
  title: string;
  items: Movie[];
  speed?: number;
  interval?: number;
  onItemClick?: (item: any) => void; 
};

/**
 * Carrusel Horizontal Infinito.
 * * Características:
 * - Scroll automático suave con soporte para velocidades sub-pixel (decimales).
 * - Scroll infinito (bucle visual).
 * - Interacción manual con rueda del mouse.
 */
export default function Carousel({
  title,
  items,
  speed = 0.8, 
  interval = 16,
  onItemClick,
}: CarouselProps) {

  // Ref para detectar si el usuario está interactuando (detendrá la animación)
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Evitará re-renders y cortes en la animación
  const isHoverRef = React.useRef(false);
  
  // Referencia para acumular decimales 
  const preciseScrollRef = React.useRef(0);

  // Almacena la velocidad actual del scroll
  const velocityRef = React.useRef(0);

  // Refs para controlar los bucles de animación
  const animationFrameRef = React.useRef<number | null>(null);
  const autoScrollRafRef = React.useRef<number | null>(null);

  // Duplicamos items para el efecto infinito
  const loopItems = React.useMemo(() => {
    const base = Array.isArray(items) ? items : [];
    return base.length ? [...base, ...base] : [];
  }, [items]);

  // Inicializar la posición precisa
  React.useEffect(() => {
    if (ref.current) preciseScrollRef.current = ref.current.scrollLeft;
  }, []);

  // Animación de scroll automático (bucle infinito)
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !loopItems.length) return;

    let last = performance.now();

    const tick = (now: number) => {
      if (!el) return;
      
      const dt = Math.min(33, now - last);
      last = now;

      // Leemos el valor del ref directamente sin depender del ciclo de render de React
      const isHovering = isHoverRef.current;
      const isManuallyScrolling = Math.abs(velocityRef.current) > 0.1;

      if (!isHovering && !isManuallyScrolling) {
        // Usamos el acumulador de precisión para permitir velocidades < 1
        preciseScrollRef.current += speed * (dt / (interval || 16));
        el.scrollLeft = preciseScrollRef.current;
        
        // Lógica de bucle infinito
        const maxScroll = el.scrollWidth / 2;
        if (el.scrollLeft >= maxScroll) {
            // Ajuste suave para evitar saltos visuales 
            const overflow = el.scrollLeft - maxScroll;
            el.scrollLeft = overflow; 
            preciseScrollRef.current = overflow; // Sincronizamos el acumulador
        }
      } else {
        // Si hay hover o scroll manual, sincronizamos el acumulador con la realidad
        preciseScrollRef.current = el.scrollLeft;
      }

      autoScrollRafRef.current = requestAnimationFrame(tick);
    };

    autoScrollRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (autoScrollRafRef.current) cancelAnimationFrame(autoScrollRafRef.current);
    };
  }, [loopItems, speed, interval]);

  // Scroll horizontal con la rueda del mouse 
  React.useEffect(() => {
    const containerEl = ref.current;
    if (!containerEl) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      velocityRef.current = e.deltaY * 0.1; // Ajustar sensibilidad
      
      // Si no hay animación de inercia corriendo, arrancarla
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(animateInertia);
      }
    };

    const animateInertia = () => {
      if (!containerEl) return;
      
      if (Math.abs(velocityRef.current) > 0.1) {
        containerEl.scrollLeft += velocityRef.current;
        // Actualizar la referencia precisa durante la inercia
        preciseScrollRef.current = containerEl.scrollLeft;
        
        velocityRef.current *= 0.95; // Fricción
        animationFrameRef.current = requestAnimationFrame(animateInertia);
      } else {
        velocityRef.current = 0;
        animationFrameRef.current = null;
      }
    };

    containerEl.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      containerEl.removeEventListener('wheel', onWheel);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [loopItems]);

  const handleCardClick = (item: any) => {
    // dispara la señal hacia el padre si existe
    onItemClick?.(item);
  };

  return (
    <section className="mt-4">
      <h2 className={`${lora.className} text-2xl font-bold text-[#3bccd4] mb-4`}>{title}</h2>
      <div
        ref={ref}
        className="relative overflow-x-auto whitespace-nowrap scrollbar-hide h-[25vw] cursor-grab active:cursor-grabbing"
        // Actualizamos el Ref 
        onMouseEnter={() => { isHoverRef.current = true; }}
        onMouseLeave={() => { isHoverRef.current = false; }}
        // Agregamos eventos táctiles para móviles por si acaso
        onTouchStart={() => { isHoverRef.current = true; }}
        onTouchEnd={() => { isHoverRef.current = false; }}
      >
        <div className="inline-flex gap-6 pr-6">
          {loopItems.length ? (
            loopItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="w-36 sm:w-40 md:w-44 flex-shrink-0 inline-block align-top"
              >
                {/* Si MovieCard ya maneja la navegación interna,
                    puedes envolverlo en un botón; de lo contrario,
                    pasa un onClick al contenedor */}
                <button
                  type="button"
                  onClick={() => handleCardClick(item)}
                  className="w-full text-left focus:outline-none"
                  aria-label={`Ver ${item.title || item.name}`}
                >
                  <MovieCard movie={item} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#e7fafa]/70">Sin resultados por ahora.</p>
          )}
        </div>
      </div>
    </section>
  );
}