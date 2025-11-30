// hooks/useMomentumScroll.ts
import { useRef, useEffect } from 'react';

export function useMomentumScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      e.preventDefault();
      velocityRef.current = e.deltaY * 0.1; // Ajuste de sensibilidad

      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      if (Math.abs(velocityRef.current) > 0.1) {
        if (containerEl) {
            containerEl.scrollLeft += velocityRef.current;
        }
        velocityRef.current *= 0.95; // Fricción
        animationFrameRef.current = requestAnimationFrame(animate);
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
  }, []);

  return containerRef;
}