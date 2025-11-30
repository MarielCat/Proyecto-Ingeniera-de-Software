// codeflix/components/Header.tsx
"use client";
import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addSearch } from "@/lib/reco";

import { useScrollDirection } from "@/hook/useScrollDirection";
import { useAuth } from "@/hook/useAuth";

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
  const router = useRouter();

  // Lógica de Scroll
  const visible = useScrollDirection();
  const { user } = useAuth(); // Ya no necesitamos 'loading' aquí si no mostramos spinner

  // Valor de entrada para búsqueda
  const [search, setSearch] = useState("");

  /**
   * Maneja eventos del teclado en la entrada de búsqueda.
   * Si al presionar Enter la barra no está vacía, navega a los resultados.
   */
  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim().length > 0) {
      const q = search.trim() ;
      // Guardar la señal de búsqueda
      addSearch({ query: q, ts: Date.now() });
      router.push(`/search?query=${encodeURIComponent(q)}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };


  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-transform duration-300
      bg-[#e0fafa]/80 backdrop-blur border-b border-[#a8e4e8]
      ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 justify-between">
        {/* Botón menú + logo */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 text-xl rounded-md hover:bg-[#ccf5f5] text-[#004b4b]"
            onClick={onMenuClick}
            aria-label="Abrir menú"
            title="Abrir menú"
          >
            ☰
          </button>

          <Link href="/" className="flex items-center gap-2">
            <img
              src="/codeflix.png"
              alt="logo"
              className="h-10 w-auto drop-shadow-md"
            />
          </Link>
        </div>

        {/* Buscador (desktop) */}
        <div className="flex-1 max-w-xl hidden md:flex items-center">
          <div className="w-full flex items-center gap-2 bg-white/90 border border-[#bdebed] rounded-full px-4 py-1">
            <span className="text-[#5aaeb2] text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar por películas, reparto o equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-transparent outline-none text-[#004b4b] placeholder:text-[#5aaeb2] text-sm"
            />
          </div>
        </div>

        {/* Usuario / Login */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#b2ecef]">
                Hola, <span className="font-semibold text-white">{user.email?.split('@')[0]}</span>
              </span>
              {/*Botón de logout */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-md shadow-red-500/30 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link href="/login">
              {/*Botón de login */}
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#00b8c4] text-white hover:bg-[#009ca7] shadow-md shadow-cyan-500/30 transition-colors">
                Iniciar sesión
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Buscador (móvil) */}
      <div className="px-4 pb-3 md:hidden">
        <div className="w-full flex items-center gap-2 bg-white/90 border border-[#bdebed] rounded-full px-4 py-1.5">
          <span className="text-[#5aaeb2] text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-transparent outline-none text-[#004b4b] placeholder:text-[#5aaeb2] text-sm"
          />
        </div>
      </div>

      <style>{`
        header input:focus {
          outline: 2px solid #00b8c4;
          outline-offset: 0;
        }
      `}</style>
    </header>
  );
}