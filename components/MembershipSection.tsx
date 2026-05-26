import Link from "next/link";
import { Heart, ShieldCheck, X, Sparkles } from "lucide-react";

export default function MembershipSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full flex flex-col">
      {/* Label */}
      <p className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase mb-4">
        Hazte parte
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Sé socio/a PLOC
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">
        Con tu aporte mensual construimos un futuro más justo, cultural y
        sostenible.
      </p>

      {/* Benefits */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#8B1A1A]" />
          </div>
          <span className="text-sm text-gray-700">Aporte seguro y transparente</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <X className="w-4 h-4 text-[#8B1A1A]" />
          </div>
          <span className="text-sm text-gray-700">Cancela cuando quieras</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#8B1A1A]" />
          </div>
          <span className="text-sm text-gray-700">Impacto real en tu comunidad</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-red-50 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-500 mb-1">Desde</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#8B1A1A]">$5.000</span>
          <span className="text-sm text-gray-500">al mes</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/socios"
        className="mt-auto flex items-center justify-center gap-2 w-full bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
      >
        <Heart className="w-4 h-4 fill-white" />
        Quiero ser socio/a
      </Link>
    </div>
  );
}
