"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header({ onMenuClick }) {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastY) setVisible(false);
      else setVisible(true);
      setLastY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full backdrop-blur bg-[#e0fafa]/80 border-b border-[#a8e4e8] transition-all duration-300 z-30
      ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-4">

        <button
          className="p-2 rounded-md hover:bg-[#ccf5f5]"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <Link href="/" className="font-bold text-xl text-[#008c95]">CineFlix</Link>

        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full max-w-md rounded-xl border border-[#bdebed] px-4 py-2 bg-white focus:outline-[#00b8c4]"
          />
        </div>

        <button className="bg-[#00b8c4] text-white px-4 py-2 rounded-xl hover:bg-[#009ca7]">
          Sign In
        </button>
      </div>
    </header>
  );
}
