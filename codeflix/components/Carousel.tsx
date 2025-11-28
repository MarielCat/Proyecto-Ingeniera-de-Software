// codeflix/components/Carousel.tsx
"use client";
import React from "react";
import MovieCard from "@/components/MovieCard";

type CarouselProps = {
  title: string;
  items: any[]; // TMDBMovie[]
  speed?: number;
  interval?: number;
  onItemClick?: (item: any) => void; // nueva prop opcional
};

export default function Carousel({
  title,
  items,
  speed = 1.2,
  interval = 16,
  onItemClick,
}: CarouselProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isHover, setIsHover] = React.useState(false);

  const loopItems = React.useMemo(() => {
    const base = Array.isArray(items) ? items : [];
    return base.length ? [...base, ...base] : [];
  }, [items]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !loopItems.length) return;
    let rafId: number | null = null;
    let last = performance.now();
    const tick = (now: number) => {
      if (!el) return;
      const dt = Math.min(33, now - last);
      last = now;
      if (!isHover) {
        el.scrollLeft += speed * (dt / (interval || 16));
        const maxScroll = el.scrollWidth / 2;
        if (el.scrollLeft >= maxScroll) el.scrollLeft = 0;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, [isHover, loopItems, speed, interval]);

  const handleCardClick = (item: any) => {
    // dispara la señal hacia el padre si existe
    onItemClick?.(item);
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-[#00a4ad] mb-4">{title}</h2>
      <div
        ref={ref}
        className="relative overflow-x-auto whitespace-nowrap scrollbar-hide h-[25vw]"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
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
