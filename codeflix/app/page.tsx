import MovieCard from "@/components/MovieCard";
import { getFantasyMovies, getGenres } from "@/lib/tmdb";

export default async function Home() {
  const movies = await getFantasyMovies(); 
  const genres = await getGenres();

  return (
    <>
      <main className="pt-[2%] px-6 max-w-6xl mx-auto">
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {Array.isArray(movies) && movies.map((m) => ( <MovieCard key={m.id} movie={m} /> ))}
        </div>

        <h2 className="text-xl font-bold text-[#00a4ad] mt-10 mb-4">Géneros</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.isArray(genres) && genres.map((g) => (
          <div 
            key={g.id}
            className="bg-[#00b8c41a] border border-[#00b8c4] text-[#e7fafa] rounded-lg px-3 py-2 text-center text-sm"
          >
            {g.name}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
