"use client";
import { useState, useEffect, useRef, type KeyboardEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addSearch } from "@/lib/reco";
import { useScrollDirection } from "@/hook/useScrollDirection";
import { useAuth } from "@/hook/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
}

interface MovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const visible = useScrollDirection();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<MovieResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce para búsqueda automática
  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const url = `/api/search-movies?query=${encodeURIComponent(search.trim())}`;
        const res = await fetch(url);
        const data = await res.json();
        
        setSuggestions(data.results || []);
        setShowDropdown(data.results?.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error al buscar:", error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigateToMovie(suggestions[selectedIndex]);
      } else if (search.trim().length > 0) {
        const q = search.trim();
        addSearch(q);
        setShowDropdown(false);
        router.push(`/search?query=${encodeURIComponent(q)}`);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const navigateToMovie = (movie: MovieResult) => {
    addSearch(movie.title);
    setShowDropdown(false);
    setSearch("");
    router.push(`/movie/${movie.id}`);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
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

        {/* Buscador con autocompletado (desktop) */}
        <div className="flex-1 max-w-xl hidden md:flex items-center relative" ref={searchRef}>
          <div className="w-full flex items-center gap-2 bg-white/90 border border-[#bdebed] rounded-full px-4 py-1 relative z-10">
            <span className="text-[#5aaeb2] text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar por películas, reparto o equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              className="w-full bg-transparent outline-none text-[#004b4b] placeholder:text-[#5aaeb2] text-sm"
            />
            {isLoading && (
              <div className="animate-spin h-4 w-4 border-2 border-[#00b8c4] border-t-transparent rounded-full" />
            )}
          </div>

          {/* Dropdown de sugerencias */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#bdebed] overflow-hidden max-h-96 overflow-y-auto z-50">
              {suggestions.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => navigateToMovie(movie)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-[#e0fafa] transition-colors text-left
                    ${selectedIndex === index ? 'bg-[#e0fafa]' : ''}`}
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded-md shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                      Sin imagen
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#004b4b] truncate">
                      {movie.title}
                    </p>
                    {movie.release_date && (
                      <p className="text-xs text-[#5aaeb2]">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Usuario / Login */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#004b4b] font-medium">
                Hola, <span className="font-semibold text-[#002b2b]">{user.email?.split('@')[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-md shadow-red-500/30 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#00b8c4] text-white hover:bg-[#009ca7] shadow-md shadow-cyan-500/30 transition-colors">
                Iniciar sesión
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Buscador móvil */}
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