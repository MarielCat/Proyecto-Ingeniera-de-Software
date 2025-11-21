import Link from "next/link";


export default function MovieCard({ movie }) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="cursor-pointer hover:scale-105 transition">
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          className="rounded-lg shadow-lg shadow-[#00b8c433]"
        />
        <h3 className="mt-2 text-sm text-center text-black">{movie.title}</h3>
      </div>
    </Link>
  );
}
