import MovieCard from "@/components/MovieCard";
import { getFantasyMovies, getGenres } from "@/lib/tmdb";

export default async function Home() {
  const movies = await getFantasyMovies(); 
  const genres = await getGenres();

  return (
    <>
   

      <main className="pt-24 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#008c95] mb-6">
          Películas de fantasía
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>

        <h2 className="text-xl font-bold text-[#00a4ad] mt-10 mb-4">Géneros</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {genres.map((g) => (
            <div
              key={g.id}
              className="bg-[#e6ffff] text-[#034447] border border-[#bcecef] rounded-xl px-3 py-2 text-center"
            >
              {g.name}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
