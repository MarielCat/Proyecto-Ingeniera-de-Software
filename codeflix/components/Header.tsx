//codeflix/components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header({ onMenuClick }) {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [search, setSearch] = useState("");

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastY) setVisible(false);
      else setVisible(true);
      setLastY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (search.trim() !== "") {
        router.push(`/search?query=${encodeURIComponent(search)}`);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full backdrop-blur bg-[#e0fafa]/80 border-b border-[#a8e4e8] transition-all duration-300 z-30
      ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="h-[7%] max-w-7xl mx-auto px-5 py-3 flex items-center gap-4 justify-center">
        <button
          className="p-2 rounded-md hover:bg-[#ccf5f5]"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <div className="h-fit px-5 py-0">
          <Link href="/" className="">
            <img src="/2.png" alt="logo" className="w-[20%]"/>
          </Link>
        </div>
        <div className="left-0 flex justify-center items-center">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-[30vw] rounded-xl border border-[#bdebed] px-4 py-2 bg-white focus:outline-[#00b8c4]"
          />
        </div>

        <button className="bg-[#00b8c4] w-[220px] text-white px-4 py-2 rounded-xl hover:bg-[#009ca7]">
          Sign In
        </button>
      </div>
    </header>
  );
}
