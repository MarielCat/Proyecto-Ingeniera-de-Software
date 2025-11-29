"use client";
import { useState, useEffect, type KeyboardEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Verificar autenticación al montar y cuando cambie la ruta
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // Escuchar evento personalizado de login
  useEffect(() => {
    const handleLoginSuccess = () => {
      checkAuth();
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);
    return () => window.removeEventListener("loginSuccess", handleLoginSuccess);
  }, []);

  // Ocultar/mostrar header al hacer scroll
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
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };


  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-transform duration-300 
      bg-slate-950/70 backdrop-blur border-b border-slate-800
      ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 justify-between">
        {/* Botón menú + logo */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full hover:bg-slate-800 text-slate-200"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <Link href="/" className="flex items-center gap-2">
            <img
              src="/2.png"
              alt="logo"
              className="h-8 w-auto drop-shadow-md"
            />
            <span className="hidden sm:inline text-slate-100 font-semibold tracking-tight">
              CodeFlix
            </span>
          </Link>
        </div>

        {/* Buscador */}
        <div className="flex-1 max-w-xl hidden md:flex items-center">
          <div className="w-full flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-full px-4 py-1">
            <span className="text-slate-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar cursos, temas o categorías..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-sm"
            />
          </div>
        </div>

        {/* Usuario / Login */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="text-slate-400 text-sm">Cargando...</div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end leading-tight">
                <span className="text-xs text-slate-400">Sesión iniciada</span>
                <span className="text-sm font-medium text-slate-100">
                  Hola, {user.email}
                </span>
              </div>

              {/* Avatar simple con la inicial del correo */}
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
                bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button
                className="px-4 py-2 rounded-full text-sm font-medium
              bg-gradient-to-r from-purple-500 to-cyan-500 text-white
              hover:from-purple-600 hover:to-cyan-600 shadow-md shadow-purple-500/40
              transition-colors"
              >
                Iniciar sesión
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Buscador visible en móvil debajo */}
      <div className="px-4 pb-3 md:hidden">
        <div className="w-full flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-full px-4 py-1.5">
          <span className="text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>
    </header>
  );
}
