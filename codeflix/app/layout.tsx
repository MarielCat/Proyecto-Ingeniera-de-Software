//codeflix/app/layout.tsx
"use client"
import type { Metadata } from "next";
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";
import { useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="es">
      <body className="bg-[#f6ffff]">
        <Header onMenuClick={() => setMenuOpen(true)} />
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <div className={`pt-20 transition-all duration-300 ${menuOpen ? "opacity-40" : "opacity-100"}`}>
          {children}
        </div>
      </body>
    </html>
  );
}


