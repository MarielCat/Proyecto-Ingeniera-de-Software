// codeflix/app/page.tsx
import Carousel from "@/components/Carousel";
import PersonalizedReco from "@/components/PersonalizedReco";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import HomeClient from "@/components/HomeClient";

import {
  getFantasyPopular,
  getFantasyTopRated,
  getFantasyLatest,
  getFantasyUpcoming,
  getFantasyTrending,
  getRecommendedFantasyByMovieId,
  getGenres,
} from "@/lib/tmdb";

import { Lora } from 'next/font/google';
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Verifica si hay un usuario autenticado en el servidor
 */
async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("codeflix_token");

    if (!token) return null;

    const decoded = jwt.verify(token.value, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    return decoded;
  } catch (err) {
    return null;
  }
}

export default async function Home() {
  // Verificar si hay usuario autenticado
  const user = await getAuthUser();

  const [
    populares,
    topRated,
    recientes,
    proximos,
    trendingFallback,
    genres,
    recomendadasSeed,
  ] = await Promise.all([
    getFantasyPopular(),
    getFantasyTopRated(200),
    getFantasyLatest(),
    getFantasyUpcoming(),
    getFantasyTrending(),
    getGenres(),
    getRecommendedFantasyByMovieId(120),
  ]);

  const recomendadas = recomendadasSeed?.length ? recomendadasSeed : trendingFallback;


  return (
    <>
      

      {/* Secciones (bloque de recomendaciones del server) */}
      <main className="px-6 max-w-7xl mx-auto h-full pt-[2vw]">
        {user && (
          <div className="">
            <div className="bg-gradient-to-r from-[#00b8c4]/20 to-[#00a4ad]/20 backdrop-blur-sm border border-[#00b8c4]/30 rounded-2xl p-6 ">
              <div className="flex items-center gap-3">
                <span className="text-2xl"></span>
                <h2 className={`${lora.className} text-2xl font-bold text-[#00e5ff]`}>
                  Recomendado para ti, {user.email.split('@')[0]}
                </h2>
              </div>
              <p className="text-[#b2ecef] text-sm">
                Basado en tus búsquedas y películas que has explorado
              </p>
            </div>
            <PersonalizedReco />
          </div>
        )}
      </main>

      {/* HomeClient: Header + SideMenu + carruseles + resultados filtrados */}
      <HomeClient
        populares={populares}
        recientes={recientes}
        topRated={topRated}
        proximos={proximos}
        recomendadas={recomendadas}
        userName={user ? user.email.split('@')[0] : null}
      />
    </>
  );
}
