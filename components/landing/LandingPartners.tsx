"use client";

const partners = [
  {
    name: "Coterráneos",
    logo: "https://coterraneos.cl/wp-content/uploads/2023/05/coterraneos_azul.png",
    url:  "https://coterraneos.cl",
  },
  {
    name: "Comunidad",
    logo: "https://comunidad-org.cl/wp-content/uploads/2024/11/Logo-Comunidad-Naranjo.png",
    url:  "https://comunidad-org.cl",
  },
  {
    name: "Kellu Causas",
    logo: "https://kellucausas.com/assets/kellu-logo-CqbT6UE0.png",
    url:  "https://kellucausas.com",
  },
];

function LogoItem({ partner, size = "md" }: { partner: typeof partners[0]; size?: "md" | "lg" }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 flex-shrink-0"
      aria-label={partner.name}
    >
      <img
        src={partner.logo}
        alt={partner.name}
        className={size === "lg" ? "h-10 lg:h-12 w-auto max-w-[160px] object-contain" : "h-9 w-auto max-w-[130px] object-contain"}
        loading="lazy"
      />
    </a>
  );
}

export default function LandingPartners() {
  return (
    <section className="bg-white border-t border-gray-100 py-12 lg:py-16">
      <style>{`
        @keyframes ploc-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ploc-marquee-track {
          animation: ploc-marquee 14s linear infinite;
        }
        .ploc-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-8 lg:mb-10">
          Con el apoyo de
        </p>

        {/* ── Desktop: fila estática ─────────────────────────────────────── */}
        <div className="hidden sm:flex items-center justify-center gap-14 lg:gap-20">
          {partners.map((p) => (
            <LogoItem key={p.name} partner={p} size="lg" />
          ))}
        </div>

        {/* ── Mobile: carrusel infinito ──────────────────────────────────── */}
        <div className="sm:hidden overflow-hidden">
          {/* Fade edges */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Track — duplicated for seamless loop */}
            <div className="ploc-marquee-track flex items-center gap-12 w-max">
              {[...partners, ...partners, ...partners].map((p, i) => (
                <LogoItem key={`${p.name}-${i}`} partner={p} size="md" />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
