/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";
import Carousel from "@/components/Carousel";

/**
 * Propiedades para `HomeClient`.
 * @property populares - Lista de películas populares (fantasía) precargadas en el servidor.
 * @property recientes - Lista de películas recientes (fantasía) precargadas en el servidor.
 * @property topRated - Lista de películas mejor calificadas (fantasía) precargadas en el servidor.
 * @property proximos - Lista de próximos estrenos (fantasía) precargadas en el servidor.
 * @property kids - Lista de recomendadas infantiles
 * @property userName - Nombre del usuario autenticado (opcional) para personalizar mensajes.
 */
interface HomeClientProps {
  populares: any[];
  recientes: any[];
  topRated: any[];
  proximos: any[];
  kids: any[];         // nueva prop
  userName?: string | null;
}


/**
 * `HomeClient`
 * - Maneja el estado del menú lateral (open) y los resultados filtrados.
 * - Llama al `SideMenu` y recibe los resultados mediante `onApplyResults`.
 * - Renderiza un carrusel adicional "Resultados filtrados" cuando hay data.
 */
export default function HomeClient({
  populares,
  recientes,
  topRated,
  proximos,
  kids,
  userName,
}: HomeClientProps) {
  // Estado del menú lateral
  const [open, setOpen] = useState(false);

  // Resultados filtrados devueltos por la API interna al aplicar filtros
  const [filtered, setFiltered] = useState<any[] | null>(null);

  return (
    <>
      <Header onMenuClick={() => setOpen(true)} />
      {/* Menú lateral de filtros */}
      <SideMenu
        open={open}
        onClose={() => setOpen(false)}
        onApplyResults={(data) => {
          setFiltered(data?.results || []);
        }}
      />

      {/* Contenido principal */}
      <main className="px-6 max-w-7xl mx-auto h-full pb-[10vh] lg:pb-[5vh]">
        {/* Si hay resultados filtrados */}
        {filtered && filtered.length > 0 && (
          <Carousel title="Resultados filtrados" items={filtered} />
        )}

        {/* Carruseles precargados desde el servidor */}
        <Carousel title="Más populares" items={populares} />
        <Carousel title="Más recientes" items={recientes} />
        <Carousel title="Mejor calificadas" items={topRated} />
        <Carousel title="Próximos estrenos" items={proximos} />
        <Carousel title="Infantiles de fantasía" items={kids} />
      </main>
    </>
  );
}