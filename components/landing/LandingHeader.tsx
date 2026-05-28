"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { org } from "@/lib/landing-config";
import { useSettings } from "@/lib/settings-context";

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isCampaignPage = pathname?.startsWith("/dona/") ?? false;
  const s = useSettings();

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
          <a href="#inicio">
            <Image src={org.logo} alt={org.name} width={120} height={54} priority />
          </a>

          {/* Single CTA — hidden on campaign detail pages */}
          {!isCampaignPage && (
            <a
              href="#proyectos"
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: s.primaryColor }}
            >
              Donar
              <Heart className="w-4 h-4 fill-white" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
