"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Menu, X } from "lucide-react";
import { org } from "@/lib/landing-config";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Impacto", href: "#impacto" },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : "border-b border-gray-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex-shrink-0">
            <Image
              src={org.logo}
              alt={org.name}
              width={120}
              height={54}
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#8B1A1A] rounded-md transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#8B1A1A] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
          </nav>

          {/* CTA + mobile burger */}
          <div className="flex items-center gap-3">
            <a
              href="#proyectos"
              className="hidden sm:flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Donar ahora
              <Heart className="w-4 h-4 fill-white" />
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#8B1A1A] hover:bg-red-50 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-2">
              <a
                href="#proyectos"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors w-full"
              >
                Donar ahora
                <Heart className="w-4 h-4 fill-white" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
