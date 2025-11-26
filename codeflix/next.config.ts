import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite cargar imágenes remotas desde TMDB
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
    ],
    // Opcional: calibra tamaños para mejorar rendimiento
    deviceSizes: [360, 640, 768, 1024, 1280],
    imageSizes: [160, 180, 200, 220, 342], // incluye 342 que usamos
    // formats: ["image/avif", "image/webp"], // puedes habilitar formatos modernos
  },
  // Si usas App Router, esto ya está bien; si tienes otras opciones, mantenlas aquí
};

export default nextConfig;
