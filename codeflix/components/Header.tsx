//codeflix/components/Header.tsx
"use client";
import { useState, useEffect, type KeyboardEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Propiedades para `Header`.
 * @property onMenuClick - llamada invocada cuando se aprieta el botón del menú lateral
 */
interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * Header de aplicación superior.
 * - Se oculta cuando usuario hace scroll hacia abajo. Si se vuelve a hacer scroll hacia arriba se vuelve a mostrar.
 * - Contiene un botón de menú para filtros de películas, logo de CODEFLIX, barra de búsqueda input y botón de inicio de sesión.
 */
export default function Header({ onMenuClick }: HeaderProps) {
  //Si header es visible 
  const [visible, setVisible] = useState(true);
  // Última posición de scroll vertical (para detectar dirección del scroll)
  const [lastY, setLastY] = useState(0);
  // Valor de entrada para búsqueda
  const [search, setSearch] = useState("");

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastY) setVisible(false);
      else setVisible(true);
      setLastY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  /**
   * Maneja eventos del teclado en la entrada de búsqueda.
   * Si al presionar Enter la barra no está vacía, navega a los resultados.
   */
  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (search.trim() !== "") {
        router.push(`/search?query=${encodeURIComponent(search)}`);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full backdrop-blur bg-[#e0fafa]/80 border-b border-[#a8e4e8] transition-all duration-300 z-30
      ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="h-[7%] max-w-7xl mx-auto px-5 py-3 flex items-center gap-4 justify-center">
        <button
          className="p-2 rounded-md hover:bg-[#ccf5f5]"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <div className="h-fit px-5 py-0">
          <Link href="/" className="">
            <img src="/2.png" alt="logo" className="w-[20%]"/>
          </Link>
        </div>
        <div className="left-0 flex justify-center items-center">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-[30vw] rounded-xl border border-[#bdebed] px-4 py-2 bg-white focus:outline-[#00b8c4]"
          />
        </div>

        <button className="bg-[#00b8c4] w-[220px] text-white px-4 py-2 rounded-xl hover:bg-[#009ca7]">
          Sign In
        </button>
      </div>
    </header>
  );
}
