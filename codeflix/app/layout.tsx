//codeflix/app/layout.tsx
"use client"

import { usePathname } from "next/navigation";
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

const localBackgroundImage = "/purple-magic-sparkling-shining-stars.png";
  const backgroundStyle = `
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('${localBackgroundImage}')
  `;


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

  // Ruta actual
  const pathname = usePathname();

  // Auxiliar para que layout sólo se mostrará en página principal
  const showHero = pathname === "/";

  return (
    <html lang="es">
      <body className="">
        {showHero && (
          /* Contenedor  con Video de Fondo */
          <div className="relative w-full h-[90vw] md:h-[40vh] lg:h-[30vw] overflow-hidden flex items-center justify-center">
            {/*Video bg */}
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
            <div className="relative text-center pt-[60vw] md:pt-[10vw] lg:pt-[14%] text-white font-bold px-10 py-20 lg:py-16">
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
        )}

        {/* Navegación y Menú Lateral */}
        <Header onMenuClick={() => setMenuOpen(true)} />
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Contenido principal*/}
        <div className={` overflow-x-hidden bg-transparent transition-all duration-300 ${menuOpen ? "opacity-40" : "opacity-100"}`}>
          {/* Contenedor con fondo */}
          <div 
            className="fixed inset-0 w-full h-full -z-10"
            style={{
              backgroundImage: backgroundStyle,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {children}
        </div>

      </body>

    </html>
  );
}


