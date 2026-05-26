import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import ActiveCampaignCard from "./ActiveCampaignCard";
import type { Campaign } from "@/lib/types";

interface HeroSectionProps {
  mainCampaign: Campaign;
  communityCount?: string;
}

export default function HeroSection({
  mainCampaign,
  communityCount = "846",
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden min-h-[560px] lg:min-h-[640px]">
      {/* Background photo — Volcán Osorno desde Puerto Octay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-puerto-octay.jpg"
          alt="Volcán Osorno y Lago Llanquihue desde Puerto Octay"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
        {/* Gradient overlay for readability: darker on left where text lives */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/20" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-12">
          {/* Left — hero text */}
          <div className="flex-1 text-white max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Impulsamos el futuro
              <br />
              de{" "}
              <span className="text-[#F87171]">Puerto Octay</span>
              <br />
              desde su propio territorio
            </h1>

            <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-lg">
              Apoya proyectos comunitarios, culturales y territoriales que
              fortalecen la vida local del sur de Chile.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/donar"
                className="inline-flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm shadow-lg shadow-red-900/40"
              >
                <Heart className="w-4 h-4 fill-white" />
                Donar ahora
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-sm border border-white/40"
              >
                Conoce los proyectos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Community social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "linear-gradient(135deg,#8B1A1A,#C0392B)",
                  "linear-gradient(135deg,#2D5A3D,#3D7A5E)",
                  "linear-gradient(135deg,#1B3A5A,#2D5A7A)",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ background: bg }}
                  />
                ))}
              </div>
              <p className="text-white/85 text-sm">
                Únete a{" "}
                <span className="text-white font-semibold">
                  {communityCount} personas
                </span>{" "}
                que ya apoyan a Puerto Octay
              </p>
            </div>
          </div>

          {/* Right — campaign card */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <ActiveCampaignCard campaign={mainCampaign} />
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
