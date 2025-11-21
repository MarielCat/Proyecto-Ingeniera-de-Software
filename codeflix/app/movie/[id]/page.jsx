import { getMovieDetails } from "@/lib/tmdb";

export default async function MoviePage({ params }) {
  const movie = await getMovieDetails(params.id);

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold text-[#00b8c4]">{movie.title}</h2>
      <p className="mt-4 text-[#b2ecef]">{movie.overview}</p>
    </div>
  );
}
