"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, Dispatch, SetStateAction, useMemo } from "react";
import { FiX } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { fetchFilteredMovies, type FilterPayload } from "@/lib/filters-client";

/**
 * Propiedades para `SideMenu`.
 * @property open - Indica si el menú lateral está visible.
 * @property onClose - Función que se ejecuta para cerrar el menú.
 * @property onApplyResults - Callback opcional para entregar al padre los resultados de la API al aplicar filtros.
 */
interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  onApplyResults?: (data: { results: any[]; page?: number; total_pages?: number; total_results?: number }) => void;
}

/**
 * Valores por defecto del rango de años:
 * - YEAR_MIN_DEFAULT: año mínimo de referencia (visual).
 * - YEAR_MAX_DEFAULT: año máximo de referencia (año actual).
 */
const YEAR_MIN_DEFAULT = 1940;
const YEAR_MAX_DEFAULT = new Date().getFullYear();

/**
 * Lista de idiomas comunes en TMDB con nombres en español y código ISO.
 * Formato mostrado: Nombre (CÓDIGO)
 */
const LANG_OPTIONS: Array<{ code: string; label: string }> = [
  { code: "es", label: "Español (ES)" },
  { code: "en", label: "Inglés (EN)" },
  { code: "fr", label: "Francés (FR)" },
  { code: "de", label: "Alemán (DE)" },
  { code: "it", label: "Italiano (IT)" },
  { code: "pt", label: "Portugués (PT)" },
  { code: "ja", label: "Japonés (JA)" },
  { code: "ko", label: "Coreano (KO)" },
  { code: "zh", label: "Chino (ZH)" },
  { code: "ru", label: "Ruso (RU)" },
  { code: "ar", label: "Árabe (AR)" },
  { code: "hi", label: "Hindi (HI)" },
  { code: "tr", label: "Turco (TR)" },
  { code: "sv", label: "Sueco (SV)" },
  { code: "nl", label: "Neerlandés (NL)" },
  { code: "pl", label: "Polaco (PL)" },
  { code: "no", label: "Noruego (NO)" },
  { code: "da", label: "Danés (DA)" },
  { code: "fi", label: "Finés (FI)" },
  { code: "cs", label: "Checo (CS)" },
];

/**
 * Componente `SideMenu`.
 * - Muestra filtros de categorías, rango de años (doble slider) e idioma original (dropdown).
 * - Aplica los filtros contra la API interna (`/api/filter-movies`) y retorna los resultados al padre mediante `onApplyResults`.
 * - El estilo es consistente con el header (tema claro con acentos en cian/teal).
 */
export default function SideMenu({ open, onClose, onApplyResults }: SideMenuProps) {
  // Listas con filtrados (estado local)
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  // Rango de años (doble slider)
  const [yearMin, setYearMin] = useState<number>(YEAR_MIN_DEFAULT);
  const [yearMax, setYearMax] = useState<number>(YEAR_MAX_DEFAULT);

  // Estado de red/errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Activa/desactiva una opción dentro de una lista de strings.
   * - Si el ítem existe, lo quita.
   * - Si no existe, lo agrega.
   * @param setState - Setter del estado correspondiente (categorías o idiomas).
   * @param list - Lista actual.
   * @param item - Ítem a alternar.
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

  /**
   * Asegura que el rango de años no se cruce:
   * - `safeYearMin` siempre es el menor.
   * - `safeYearMax` siempre es el mayor.
   */
  const safeYearMin = Math.min(yearMin, yearMax);
  const safeYearMax = Math.max(yearMin, yearMax);

  /**
   * Calcula el estilo visual de la barra activa del rango (porcentajes relativos).
   * - `startPct`: posición inicial del rango en porcentaje.
   * - `endPct`: posición final del rango en porcentaje.
   */
  const rangeStyle = useMemo(() => {
    const total = YEAR_MAX_DEFAULT - YEAR_MIN_DEFAULT;
    const startPct = ((safeYearMin - YEAR_MIN_DEFAULT) / total) * 100;
    const endPct = ((safeYearMax - YEAR_MIN_DEFAULT) / total) * 100;
    return { startPct, endPct };
  }, [safeYearMin, safeYearMax]);

  /**
   * Aplica los filtros:
   * - Construye el `payload` con categorías, idiomas y rango de años.
   * - Llama a `fetchFilteredMovies` (API interna).
   * - Entrega resultados al padre con `onApplyResults` y cierra el menú.
   * - Muestra estados de carga y errores.
   */
  const handleApply = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: FilterPayload = {
        categories,
        languages,
        yearMin: safeYearMin,
        yearMax: safeYearMax,
        sortBy: "popularity.desc",
      };
      const data = await fetchFilteredMovies(payload);
      onApplyResults?.(data);
      onClose();
    } catch (e: any) {
      setError(e?.message || "Error al aplicar filtros");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Restablece el rango de años a sus valores por defecto.
   */
  const handleResetYears = () => {
    setYearMin(YEAR_MIN_DEFAULT);
    setYearMax(YEAR_MAX_DEFAULT);
  };

  /**
   * Limpia todos los filtros:
   * - Vacía categorías e idiomas.
   * - Reestablece el rango de años.
   */
  const handleClearAll = () => {
    setCategories([]);
    setLanguages([]);
    handleResetYears();
  };

  /**
   * Añade un idioma desde el dropdown (evita duplicados).
   */
  const addLanguage = (code: string) => {
    if (!code) return;
    if (!languages.includes(code)) {
      setLanguages((prev) => [...prev, code]);
    }
  };

  /**
   * Elimina un idioma seleccionado.
   */
  const removeLanguage = (code: string) => {
    setLanguages((prev) => prev.filter((c) => c !== code));
  };

  /**
   * Obtiene la etiqueta en español para un código de idioma dado.
   */
  const getLabel = (code: string) => {
    return LANG_OPTIONS.find((o) => o.code === code)?.label || code.toUpperCase();
  };

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
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-[#005f63]">Categorías</p>
          </div>
          {["Fantasía infantil", "Fantasía oscura", "Fantasía épica", "Fantasía urbana"].map((cat) => {
            const checked = categories.includes(cat);
            return (
              <label key={cat} className="flex items-center mb-2 gap-3 cursor-pointer text-[#004b4b]">
                {/* Checkbox moderno (shadcn/ui) */}
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(setCategories, categories, cat)}
                  className="data-[state=checked]:bg-[#00b8c4] data-[state=checked]:border-[#00b8c4]"
                />
                <span className="text-sm">{cat}</span>
              </label>
            );
          })}
        </div>

        {/* Año (doble slider estilo barra) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-[#005f63]">Año de estreno</p>
            <button
              type="button"
              onClick={handleResetYears}
              className="text-xs text-[#5aaeb2] hover:text-[#004b4b]"
            >
              Reset
            </button>
          </div>

          {/* Contenedor del slider con pista y thumbs (doble input[type="range"] superpuesto) */}
          <div className="relative h-8">
            {/* Pista base */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 rounded-full bg-[#bdebed]"></div>
            {/* Rango activo */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#004b4b]"
              style={{
                left: `${rangeStyle.startPct}%`,
                right: `${100 - rangeStyle.endPct}%`,
              }}
            ></div>

            {/* Slider Min */}
            <input
              type="range"
              min={YEAR_MIN_DEFAULT}
              max={YEAR_MAX_DEFAULT}
              value={safeYearMin}
              onChange={(e) => setYearMin(Number(e.target.value))}
              className="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-auto"
            />
            {/* Slider Max */}
            <input
              type="range"
              min={YEAR_MIN_DEFAULT}
              max={YEAR_MAX_DEFAULT}
              value={safeYearMax}
              onChange={(e) => setYearMax(Number(e.target.value))}
              className="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-auto"
            />

            {/* Estilos del thumb/pista para rangos (consistente con el tema) */}
            <style>{`
              input[type="range"] {
                -webkit-appearance: none;
                height: 0;
              }
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 9999px;
                background: #ffffff;
                border: 2px solid #004b4b;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                cursor: pointer;
                margin-top: -8px; /* centra el thumb sobre la pista */
              }
              input[type="range"]::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 9999px;
                background: #ffffff;
                border: 2px solid #004b4b;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                cursor: pointer;
              }
              input[type="range"]::-webkit-slider-runnable-track {
                height: 2px;
                background: transparent;
              }
              input[type="range"]::-moz-range-track {
                height: 2px;
                background: transparent.
              }
            `}</style>
          </div>

          {/* Etiquetas de extremos (muestran el rango activo) */}
          <div className="mt-2 flex justify-between text-xs text-[#004b4b]">
            <span>{safeYearMin}</span>
            <span>{safeYearMax}</span>
          </div>
        </div>

        {/* Idioma original: Dropdown  */}
        <div className="mb-4">
          <p className="font-semibold text-[#005f63] mb-2">Idioma original</p>

          {/* Chips de idiomas seleccionados */}
          {languages.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {languages.map((code) => (
                <span
                  key={`lang-chip-${code}`}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/90 border border-[#bdebed] text-[#004b4b]"
                >
                  {getLabel(code)}
                  <button
                    type="button"
                    aria-label={`Quitar ${getLabel(code)}`}
                    className="text-[#004b4b] hover:text-[#00b8c4]"
                    onClick={() => removeLanguage(code)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Select para agregar un idioma */}
          <Select onValueChange={addLanguage}>
            <SelectTrigger className="w-full bg-white/90 border border-[#bdebed] text-[#004b4b]">
              <SelectValue placeholder="Agregar idioma…" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 border border-[#bdebed]">
              {LANG_OPTIONS.map((opt) => (
                <SelectItem key={opt.code} value={opt.code} className="text-[#004b4b]">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estado y acciones */}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg:white/90 border border-[#bdebed] text-[#004b4b] hover:bg-[#ccf5f5] transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#00b8c4] text-white hover:bg-[#009ca7] shadow-md shadow-cyan-500/30 transition-colors disabled:opacity-60"
          >
            {loading ? "Aplicando..." : "Aplicar"}
          </button>
        </div>
      </aside>
    </>
  );
}