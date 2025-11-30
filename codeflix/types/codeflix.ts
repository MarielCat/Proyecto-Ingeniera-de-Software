// Interfaz base para Películas
export interface Movie {
  id: number;
  title?: string;      // Películas
  name?: string;       // Series
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  release_date?: string;
}

// Interfaz base para Personas (Actores, Directores, etc.)
export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
}

// Extensión para el Reparto (Cast)
export interface CastMember extends Person {
  character: string;
  order?: number;
}

// Extensión para el Equipo Técnico (Crew/Directores)
export interface CrewMember extends Person {
  job: string;
  department?: string;
}

// Interfaz para Imágenes
export interface MovieImage {
  file_path: string;
  aspect_ratio?: number;
  width?: number;
  height?: number;
}