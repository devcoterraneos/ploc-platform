import { Heart } from "lucide-react";
import { membership, org } from "@/lib/landing-config";
import { formatCLP } from "@/lib/data";

export default function LandingMembership() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 h-full flex flex-col justify-between shadow-sm">
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-5">
        <Heart className="w-6 h-6 text-[#8B1A1A] fill-[#8B1A1A]" />
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{membership.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {membership.description}
        </p>

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1">Desde</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCLP(membership.fromAmount)}{" "}
            <span className="text-base font-normal text-gray-400">
              {membership.fromLabel}
            </span>
          </p>
        </div>
      </div>

      <a
        href="#proyectos"
        className="w-full flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
      >
        {membership.ctaText}
      </a>
    </div>
  );
}
