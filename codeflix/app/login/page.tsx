"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const url = mode === "login" ? "/api/login" : "/api/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.message || "Error", type: "error" });
        setLoading(false);
        return;
      }

      if (mode === "register") {
        setMessage({ text: "Usuario creado, ahora inicia sesión.", type: "success" });
        setMode("login");
        setPassword("");
        setLoading(false);
      } else {
        // Disparar evento para actualizar el Header
        window.dispatchEvent(new Event("loginSuccess"));
        
        // Redirigir al dashboard principal
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : "Error de conexión";
      setMessage({ text: errorText, type: "error" }); // objeto válido
      setLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004b4b] to-[#002b2b] pt-[7vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-white/20"
      >
        <div className="text-center mb-6">
          <div className="w-40 h-40 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg shadow-white/20">
            <img src="/codeflix.png" alt="CodeFlix" className="w-28" />
          </div>      
          <h1 className="text-2xl font-bold text-white">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
        </div>

        {message && (
          <div
            className={`text-sm text-center p-3 rounded-lg ${
              message.type === "success"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}



        <div>
          <label className="block text-sm text-[#b2ecef] mb-1">Correo</label>
          <input
            type="email"
            className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#00b8c4] focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm text-[#b2ecef] mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#00b8c4] focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 rounded-lg font-semibold bg-[#00b8c4] hover:bg-[#009ca7] text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Registrarme"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setMessage(null); // correcto para el tipo {text,type} | null
          }}          
          className="w-full text-sm text-[#b2ecef] hover:text-white mt-2 transition"
          disabled={loading}
        >

          {mode === "login"
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </form>
    </div>
  );
}