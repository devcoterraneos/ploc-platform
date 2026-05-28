import type { Metadata } from "next";
import { Heart } from "lucide-react";
import GraciasShare from "@/components/landing/GraciasShare";

export const metadata: Metadata = {
  title: "¡Gracias por tu aporte!",
  description: "Tu donación a la Corporación PLOC fue procesada con éxito.",
};

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Heart icon */}
        <div className="w-20 h-20 rounded-full bg-[#8B1A1A] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-900/20">
          <Heart className="w-10 h-10 text-white fill-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          ¡Gracias por tu aporte!
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          Tu donación fue procesada con éxito.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Recibirás un correo de confirmación con los detalles de tu aporte.
          Tu contribución apoya directamente proyectos en Puerto Octay.
        </p>

        {/* Impact message */}
        <div className="bg-red-50 rounded-2xl p-6 mb-10 border border-red-100">
          <p className="text-[#8B1A1A] font-semibold mb-1">
            Puerto Octay te lo agradece
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            "Puerto Octay es más que un lugar, es nuestra casa. Cuidarlo y proyectarlo
            depende de todos nosotros." — Equipo Corporación Ploc
          </p>
        </div>

        {/* Share CTA */}
        <GraciasShare />
      </div>
    </div>
  );
}
