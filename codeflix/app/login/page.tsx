"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const url = mode === "login" ? "/api/login" : "/api/register";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Error");
      return;
    }

    if (mode === "register") {
      setMessage("Usuario creado, ahora inicia sesión.");
      setMode("login");
      setPassword("");
    } else {
      // Disparar evento para actualizar el Header
      window.dispatchEvent(new Event("loginSuccess"));
      // Redirigir a /movie (tu dashboard de películas)
      router.push("/movie");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-white text-center">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>

        {message && (
          <p className="text-sm text-center text-emerald-300">{message}</p>
        )}

        <div>
          <label className="block text-sm text-slate-200 mb-1">Correo</label>
          <input
            type="email"
            className="w-full rounded-md px-3 py-2 bg-slate-900 border border-slate-700 text-slate-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-200 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full rounded-md px-3 py-2 bg-slate-900 border border-slate-700 text-slate-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-md font-semibold bg-emerald-500 hover:bg-emerald-600"
        >
          {mode === "login" ? "Entrar" : "Registrarme"}
        </button>

        <button
          type="button"
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          className="w-full text-xs text-slate-300 mt-2 underline"
        >
          {mode === "login"
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </form>
    </div>
  );
}