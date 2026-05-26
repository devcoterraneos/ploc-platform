import Link from "next/link";
import { Heart } from "lucide-react";

interface FinalCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function FinalCTA({
  title = "Sigamos construyendo el futuro\nde Puerto Octay, juntos.",
  subtitle = "Cada aporte cuenta. Cada persona suma. Sé parte del cambio desde tu territorio.",
  buttonText = "Donar ahora",
}: FinalCTAProps) {
  return (
    <section className="bg-[#8B1A1A] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Seal icon */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                <circle cx="40" cy="40" r="34" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                <line x1="18" y1="50" x2="62" y2="50" stroke="white" strokeWidth="2" />
                <path d="M40 18 L58 50 L22 50 Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
                <text x="40" y="68" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">PLOC</text>
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 leading-tight whitespace-pre-line">
              {title}
            </h2>
            <p className="text-white/80 text-base lg:text-lg">{subtitle}</p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/donar"
              className="inline-flex items-center gap-2 bg-white text-[#8B1A1A] hover:bg-gray-50 font-bold px-8 py-4 rounded-full transition-colors text-sm shadow-lg"
            >
              {buttonText}
              <Heart className="w-4 h-4 fill-[#8B1A1A]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
