"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecommendationsSection from "./RecommendationsSection";

/**
 * Página de recomendaciones:
 *  - Verifica autenticación con /api/me
 *  - Si NO está autenticado -> redirige al dashboard principal ("/")
 *  - Si SÍ está autenticado -> muestra las recomendaciones
 */
export default function RecommendationsPage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          // ❗ No autenticado -> mandar al dashboard principal
          router.push("/"); // cambia "/" si tu dashboard está en otra ruta
        }
      } catch (err) {
        router.push("/"); // en error también lo mandamos al dashboard
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loadingUser) {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center bg-slate-950 text-slate-200">
        Verificando sesión...
      </main>
    );
  }

  // Si no hay usuario, ya se hizo push("/") arriba
  if (!user) return null;

  return (
    <main className="min-h-screen pt-24 px-6 bg-slate-950 text-slate-100">
      <section className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold">
            Recomendaciones para {user.email}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Esta página está marcada para que el equipo implemente recomendaciones
            personalizadas basadas en el usuario autenticado.
          </p>
        </header>

        <RecommendationsSection user={user} />
      </section>
    </main>
  );
}
