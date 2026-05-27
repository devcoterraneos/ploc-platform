import Image from "next/image";
import { Heart } from "lucide-react";
import { defaultSiteSettings } from "@/lib/data";

export default function LandingHero() {
  const s = defaultSiteSettings;
  const titleLines = s.heroTitle.split("\n");

  return (
    <section id="inicio" className="relative overflow-hidden min-h-[500px] lg:min-h-[580px]">
      {/* Background photo */}
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
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/65 to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}{" "}
            <span className="text-[#8B1A1A]">{s.heroHighlight}</span>
          </h1>

          <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-lg">
            {s.heroSubtitle}
          </p>

          <a
            href="#proyectos"
            className="inline-flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold px-8 py-4 rounded-full transition-colors text-base shadow-lg shadow-red-900/25"
          >
            <Heart className="w-5 h-5 fill-white" />
            Dona a un proyecto
          </a>
        </div>
      </div>

      {/* Photo credit */}
      <div className="absolute bottom-2 right-3">
        <span className="text-white/40 text-xs">
          © Wikimedia Commons / eurimaco — CC BY-SA 3.0
        </span>
      </div>
    </section>
  );
}
