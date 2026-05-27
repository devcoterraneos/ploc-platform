import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import { hero, activeCampaign } from "@/lib/landing-config";
import { formatCLP } from "@/lib/data";

function CampaignCard() {
  const pct = Math.min(
    Math.round((activeCampaign.raised / activeCampaign.goal) * 100),
    100
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-100">
      {/* Label */}
      <p className="text-xs font-bold tracking-widest text-[#8B1A1A] mb-3 uppercase">
        {activeCampaign.label}
      </p>

      {/* Name + description */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">{activeCampaign.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{activeCampaign.description}</p>

      {/* Amount raised */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-2xl font-bold text-[#8B1A1A]">
          {formatCLP(activeCampaign.raised)}
        </span>
        <span className="text-sm text-gray-400">
          de {formatCLP(activeCampaign.goal)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-1">
        <div
          className="h-full bg-[#8B1A1A] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs font-semibold text-[#8B1A1A] mb-5">{pct}%</p>

      {/* Suggested amounts */}
      <div className="flex gap-2 mb-4">
        {activeCampaign.suggestedAmounts.map((amt) => (
          <button
            key={amt}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors"
          >
            {formatCLP(amt)}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button className="w-full flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold py-3.5 rounded-xl transition-colors">
        <Heart className="w-4 h-4 fill-white" />
        {activeCampaign.ctaText}
      </button>
    </div>
  );
}

export default function LandingHero() {
  return (
    <section id="inicio" className="relative overflow-hidden min-h-[580px] lg:min-h-[660px]">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
        {/* Light gradient on left for text readability — dark on right to keep photo visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — text */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {hero.titleLine1}
              <br />
              {hero.titleLine2}{" "}
              <span className="text-[#8B1A1A]">{hero.titleHighlight}</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md">
              {hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#proyectos"
                className="inline-flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm shadow-lg shadow-red-900/25"
              >
                <Heart className="w-4 h-4 fill-white" />
                {hero.ctaPrimary}
              </a>
              <a
                href="#proyectos"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-7 py-3.5 rounded-full transition-colors text-sm border border-gray-200 shadow-sm"
              >
                {hero.ctaSecondary}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right — campaign card */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <CampaignCard />
          </div>
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
