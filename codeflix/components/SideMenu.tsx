"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { FiX } from "react-icons/fi";

/**
 * Propiedades para SideMenu
 * - `open`: boolean que determina si una opción está activada
 */
interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function SideMenu({ open, onClose }: SideMenuProps) {
  // Listas con filtrados
  const [categories, setCategories] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  /**
   * Activa/desactiva una opción de la lista.
   *
   * @param setState - Set de estados para la lista
   * @param list - lista de opciones
   * @param item - opción a elegir 
   */
  function toggle(
    setState: Dispatch<SetStateAction<string[]>>,
    list: string[],
    item: string
  ) {
    if (list.includes(item)) {
      setState(list.filter((x) => x !== item));
    } else {
      setState([...list, item]);
    }
  }

  return (
    <>
      {/* Overlay semitransparente: clic para cerrar */}
      <div
        className={`fixed inset-0 bg-[#e0fafa]/40 backdrop-blur-sm z-40 transition-opacity duration-300 
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 
        bg-[#e0fafa]/85 backdrop-blur border-r border-[#a8e4e8]
        shadow-xl p-5 z-50 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de contenido"
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar filtros"
          className="absolute top-3 right-3 p-2 rounded-md text-[#004b4b] hover:bg-[#ccf5f5] hover:text-[#004b4b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b8c4]"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold text-[#004b4b] mb-4">Filtros</h2>

        {/* Categorías */}
        <div className="mb-6">
          <p className="font-semibold text-[#005f63] mb-2">Categorías</p>
          {["Fantasía infantil", "Fantasía oscura", "Fantasía épica", "Fantasía urbana"].map((cat) => (
            <label key={cat} className="flex items-center mb-2 gap-2 cursor-pointer text-[#004b4b]">
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => toggle(setCategories, categories, cat)}
                className="accent-[#00b8c4] w-4 h-4"
              />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>

        {/* Año */}
        <div className="mb-6">
          <p className="font-semibold text-[#005f63] mb-2">Año</p>
          {["2020-2024", "2010-2019", "2000-2009", "1990-1999"].map((year) => (
            <label key={year} className="flex items-center mb-2 gap-2 cursor-pointer text-[#004b4b]">
              <input
                type="checkbox"
                checked={years.includes(year)}
                onChange={() => toggle(setYears, years, year)}
                className="accent-[#00b8c4] w-4 h-4"
              />
              <span className="text-sm">{year}</span>
            </label>
          ))}
        </div>

        {/* Idioma original */}
        <div className="mb-2">
          <p className="font-semibold text-[#005f63] mb-2">Idioma original</p>
          {["en", "es", "fr", "ja"].map((lang) => (
            <label key={lang} className="flex items-center mb-2 gap-2 cursor-pointer text-[#004b4b]">
              <input
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => toggle(setLanguages, languages, lang)}
                className="accent-[#00b8c4] w-4 h-4"
              />
              <span className="text-sm uppercase">{lang}</span>
            </label>
          ))}
        </div>

        {/* Acciones */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setCategories([]);
              setYears([]);
              setLanguages([]);
            }}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 border border-[#bdebed] text-[#004b4b] hover:bg-[#ccf5f5] transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#00b8c4] text-white hover:bg-[#009ca7] shadow-md shadow-cyan-500/30 transition-colors"
          >
            Aplicar
          </button>
        </div>
      </aside>
    </>
  );
}