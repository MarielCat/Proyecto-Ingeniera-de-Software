"use client";
import { useAuth } from "@/hooks/useAuth";


export default function RecommendationsPage() {
  // Sacar usuario
  const {user, loading} = useAuth(true);

  if (loading) {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center bg-slate-950 text-slate-200">
        Verificando sesión...
      </main>
    );
  }

  // Si por alguna razón no hay user, ya se hizo push("/") en useAuth
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
