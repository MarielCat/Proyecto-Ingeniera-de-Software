"use client";
import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function SideMenu({ open, onClose }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  function toggle(setState, list, item) {
    if (list.includes(item)) {
      setState(list.filter((x) => x !== item));
    } else {
      setState([...list, item]);
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[1px] z-30 transition-opacity duration-300 
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-[#d6f4f6] shadow-xl p-5 z-40 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 p-2 rounded-md text-[#046670] hover:bg-[#eafcfd] hover:text-[#00b8c4] transition-colors"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold text-[#008c95] mb-4">Filtros</h2>

        <div className="mb-6">
          <p className="font-semibold text-[#046670] mb-2">Categorías</p>
          {["Fantasía infantil", "Fantasía oscura", "Fantasía épica", "Fantasía urbana"].map((cat) => (
            <label key={cat} className="flex items-center mb-1 gap-2">
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => toggle(setCategories, categories, cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        <div className="mb-6">
          <p className="font-semibold text-[#046670] mb-2">Año</p>
          {["2020-2024", "2010-2019", "2000-2009", "1990-1999"].map((year) => (
            <label key={year} className="flex items-center mb-1 gap-2">
              <input
                type="checkbox"
                checked={years.includes(year)}
                onChange={() => toggle(setYears, years, year)}
              />
              {year}
            </label>
          ))}
        </div>

        <div className="mb-6">
          <p className="font-semibold text-[#046670] mb-2">Idioma original</p>
          {["en", "es", "fr", "ja"].map((lang) => (
            <label key={lang} className="flex items-center mb-1 gap-2">
              <input
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => toggle(setLanguages, languages, lang)}
              />
              {lang}
            </label>
          ))}
        </div>
      </aside>
    </>
  );
}
