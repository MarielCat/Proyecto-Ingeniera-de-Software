// hooks/useScrollDirection.ts
import { useState, useEffect } from 'react';

export function useScrollDirection() {
    //Si header es visible 
  const [isVisible, setIsVisible] = useState(true);
  // Última posición de scroll vertical (para detectar dirección del scroll)
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Mostrar header siempre al estar arriba
      if (currentY > lastY && currentY > 50) {
        setIsVisible(false); // Bajando -> Ocultar
      } else {
        setIsVisible(true);  // Subiendo -> Mostrar
      }
      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  return isVisible;
}