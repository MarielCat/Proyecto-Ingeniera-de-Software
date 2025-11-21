import MovieCard from "../components/MovieCard";
import { getPopularMovies } from "@/lib/tmdb";
import { getFantasyMovies } from "@/lib/tmdb";
import { getGenres } from "@/lib/tmdb";


export default async function Home() {
  const movies = await getFantasyMovies();
  const genres=await getGenres();

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#00b8c4] mb-6">Películas de fantasía</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        {Array.isArray(movies) && movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
      <h2 className="text-xl font-bold text-[#00b8c4] mb-4">Géneros</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.isArray(genres) && genres.map((g) => (
          <div 
            key={g.id}
            className="bg-[#00b8c41a] text-black border border-[#00b8c4] rounded-lg px-3 py-2 text-center text-sm"
          >
            {g.id}
            <br />
            {g.name}
          </div>
        ))}
      </div>


    </main>

  );
}
