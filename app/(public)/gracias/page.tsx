"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, XCircle, Clock } from "lucide-react";
import GraciasShare from "@/components/landing/GraciasShare";

type PaymentState = "loading" | "success" | "cancelled" | "direct";

export default function GraciasPage() {
  const [state, setState] = useState<PaymentState>("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");

    if (!token) {
      setState("direct");
      return;
    }

    // Verificar estado real consultando Supabase a través del token
    // Por ahora distinguimos solo si vino de Flow (tiene token) vs acceso directo
    // El webhook ya actualizó el estado en Supabase
    setState("success");
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#8B1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Acceso directo sin token — redirige al home
  if (state === "direct") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            ¿Quieres apoyar un proyecto?
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Elige una campaña y haz tu donación.
          </p>
          <Link
            href="/#proyectos"
            className="inline-flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Ver campañas
          </Link>
        </div>
      </div>
    );
  }

  // Vino de Flow — pago procesado (éxito o pendiente, el webhook confirma)
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#8B1A1A] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-900/20">
          <Heart className="w-10 h-10 text-white fill-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          ¡Gracias por tu aporte!
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          Tu donación fue registrada con éxito.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Recibirás un correo de confirmación con los detalles de tu aporte.
          Tu contribución apoya directamente proyectos en Puerto Octay.
        </p>

        {/* Processing note */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-6 text-left">
          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            La confirmación del pago puede demorar unos minutos. Si realizaste el pago correctamente,
            recibirás un email de confirmación de Flow y de Corporación PLOC.
          </p>
        </div>

        {/* Quote */}
        <div className="bg-red-50 rounded-2xl p-6 mb-10 border border-red-100">
          <p className="text-[#8B1A1A] font-semibold mb-1">
            Puerto Octay te lo agradece
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            &ldquo;Puerto Octay es más que un lugar, es nuestra casa. Cuidarlo y proyectarlo
            depende de todos nosotros.&rdquo; — Equipo Corporación Ploc
          </p>
        </div>

        {/* Share */}
        <GraciasShare />

        <Link
          href="/#proyectos"
          className="inline-block mt-6 text-sm text-gray-400 hover:text-[#8B1A1A] transition-colors"
        >
          Ver más proyectos →
        </Link>
      </div>
    </div>
  );
}
