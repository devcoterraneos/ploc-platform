"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

export default function LandingHero() {
  const s = useSettings();
  const titleLines = s.heroTitle.split("\n");

  return (
    <section id="inicio" className="relative overflow-hidden min-h-[500px] lg:min-h-[580px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={s.heroImageUrl}
          alt="Vista territorial"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
        {/* Dark gradient overlay — left heavy so text always contrasts */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />
        {/* Subtle bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-sm">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}{" "}
            <span style={{ color: s.primaryColor }}>{s.heroHighlight}</span>
          </h1>

          <p className="text-white/85 text-lg mb-10 leading-relaxed max-w-lg">
            {s.heroSubtitle}
          </p>

          <a
            href="#proyectos"
            className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-full transition-all text-base shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: s.primaryColor }}
          >
            <Heart className="w-5 h-5 fill-white" />
            {s.heroDonarText}
          </a>
        </div>
      </div>

      <div className="absolute bottom-2 right-3">
        <span className="text-white/30 text-xs">
          © Wikimedia Commons / eurimaco — CC BY-SA 3.0
        </span>
      </div>
    </section>
  );
}
