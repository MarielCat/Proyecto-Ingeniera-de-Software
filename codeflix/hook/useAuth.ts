// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * useAuth:
 *  - Revisa si hay usuario autenticado llamando a /api/me
 *  - Si NO hay usuario -> redirige al dashboard principal (ej. "/")
 *  - Si SÍ hay usuario -> muestra la sección de recomendaciones
 */
export function useAuth(requireAuth = false) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (requireAuth) {
            // si no hay usuario, mandar al dashboard principal 
            router.push("/");
        }
      } catch (err) {
        if (requireAuth) router.push("/");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, requireAuth]);

  return { user, loading };
}