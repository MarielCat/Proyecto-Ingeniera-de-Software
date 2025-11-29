"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecommendationsSection from "./RecommendationsSection";

/**
 * Este componente:
 *  - Revisa si hay usuario autenticado llamando a /api/me
 *  - Si NO hay usuario -> redirige al dashboard principal (ej. "/")
 *  - Si SÍ hay usuario -> muestra la sección de recomendaciones
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
          setUser(null);
          // TODO: si no hay usuario, mandar al dashboard principal real
          // Cambiar "/" por la ruta real de su dashboard si es diferente.
          router.push("/");
        }
      } catch (err) {
        setUser(null);
        router.push("/");
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

  // Si por alguna razón no hay user, ya se hizo push("/") arriba.
  if (!user) return null;

  return (
    <main className="min-h-screen pt-24 px-6 bg-slate-950 text-slate-100">
      <section className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold">
            Recomendaciones para {user.email}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            TODO: aquí se mostrarán recomendaciones personalizadas según el
            usuario autenticado.
          </p>
        </header>

        {/* Lógica de recomendaciones en otro archivo */}
        <RecommendationsSection user={user} />

        {/* Si quieren, aquí pueden agregar más secciones relacionadas */}
      </section>
    </main>
  );
}
