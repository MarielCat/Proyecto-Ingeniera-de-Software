//codeflix/app/layout.tsx
"use client"
import type { Metadata } from "next";
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";
import { useState } from "react";
import "./globals.css";

// Configuración de fuentes de Google 
import { Cinzel } from 'next/font/google';
const cinzel = Cinzel({ 
    subsets: ['latin'], 
    weight: ['700'] 
});

import { Lora } from 'next/font/google';
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});


/**
 * Layout Raíz de la Aplicación.
 * 1. Define la estructura HTML básica (html, body).
 * 2. Renderiza un fondo de video persistente.
 * 3. Gestiona el estado global del menú lateral.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="es">
      <body className="bg-[#f6ffff]">
        {/* Contenedor  con Video de Fondo */}
      <div className="relative w-full h-[30vw] overflow-hidden flex items-center justify-center">
          {/*video bg */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/bg.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Overlay oscuro para legibilidad del texto */}
          <div className="absolute inset-0 bg-[#004b4b]/70" />

          {/* Texto central */}
          <div className="relative text-center pt-[14%] text-white font-bold py-16">
            <h1 className={`${cinzel.className} text-7xl font-extrabold  mb-6`}>
              CodeFlix
            </h1>
            <p className={`${cinzel.className} text-lg pb-[1%]`}>
              Tu guía de fantasía
            </p>
            <p className={`${lora.className} text-md pb-[1%] font-normal italic`}>
              Busca, filtra y descubre películas que encajan con tu mundo.
            </p>
          </div>
        </div>

        {/* Navegación y Menú Lateral */}
        <Header onMenuClick={() => setMenuOpen(true)} />
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Contenido principal*/}
        <div className={`bg-[#f6ffff] pt-[3%] transition-all duration-300 ${menuOpen ? "opacity-40" : "opacity-100"}`}>
        
          {children}
        </div>
      </body>
    </html>
  );
}


