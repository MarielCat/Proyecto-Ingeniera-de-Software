const API_KEY = process.env.TMDB_KEY;
const base = "https://api.themoviedb.org/3";

export async function getPopularMovies() {
  const res = await fetch(`${base}/movie/popular?api_key=${API_KEY}&language=es-MX`);
  const data = await res.json();
  console.log("DATA TMDB:", data); 

  return data.results;
}

export async function getMovieDetails(id) {
  const res = await fetch(`${base}/movie/${id}?api_key=${API_KEY}&language=es-MX`);
  return res.json();
}

//este es el q nos interesa
export async function getFantasyMovies() {
    const res = await fetch(
      `${base}/discover/movie?api_key=${API_KEY}&with_genres=14&language=es-MX&sort_by=popularity.desc`
    );
  
    const data = await res.json();
    return data.results || [];
  }
  

//pa ver todos los generos 
export async function getGenres() {
    const res = await fetch(`${base}/genre/movie/list?api_key=${API_KEY}&language=es-MX`);
    const data = await res.json();
    return data.genres;
  }
  