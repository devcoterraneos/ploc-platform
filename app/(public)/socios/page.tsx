"use client";

import { useState } from "react";
import { Heart, ShieldCheck, X, Sparkles, Check } from "lucide-react";
import { formatCLP } from "@/lib/data";

const MONTHLY_AMOUNTS = [5000, 10000, 15000, 20000, 30000];

const benefits = [
  { icon: ShieldCheck, text: "Aporte seguro y completamente transparente" },
  { icon: X, text: "Cancela cuando quieras, sin compromisos" },
  { icon: Sparkles, text: "Impacto real y medible en tu comunidad" },
  { icon: Heart, text: "Acceso a reportes exclusivos de uso de fondos" },
];

export default function SociosPage() {
  const [selectedAmount, setSelectedAmount] = useState(10000);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [step, setStep] = useState<"choose" | "data">("choose");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const finalAmount = showCustom && customAmount ? parseInt(customAmount, 10) : selectedAmount;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-[#8B1A1A] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            Sé socio/a de PLOC
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Con tu aporte mensual construimos un futuro más justo, cultural y
            sostenible para Puerto Octay.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Benefits */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              ¿Por qué ser socio/a?
            </h2>
            <div className="space-y-4">
              {benefits.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#8B1A1A]" />
                  </div>
                  <p className="text-sm text-gray-700 pt-1.5">{text}</p>
                </div>
              ))}
            </div>

            {/* Impact message */}
            <div className="mt-8 bg-red-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Tu impacto mensual</h3>
              <div className="space-y-2">
                {[
                  { amount: 5000, impact: "Financia materiales educativos para un niño" },
                  { amount: 10000, impact: "Apoya una jornada de restauración patrimonial" },
                  { amount: 20000, impact: "Sostiene actividades comunitarias mensuales" },
                  { amount: 30000, impact: "Impulsa un micro-proyecto territorial" },
                ].map(({ amount, impact }) => (
                  <div key={amount} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8B1A1A] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      <strong className="text-[#8B1A1A]">{formatCLP(amount)}/mes:</strong>{" "}
                      {impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {step === "choose" ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Elige tu aporte mensual
                </h2>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {MONTHLY_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => { setSelectedAmount(amount); setShowCustom(false); }}
                      className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                        selectedAmount === amount && !showCustom
                          ? "bg-[#8B1A1A] text-white border-[#8B1A1A]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#8B1A1A]"
                      }`}
                    >
                      {formatCLP(amount).replace("$ ", "$")}
                    </button>
                  ))}
                  <button
                    onClick={() => { setShowCustom(true); setSelectedAmount(0); }}
                    className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                      showCustom
                        ? "bg-[#8B1A1A] text-white border-[#8B1A1A]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#8B1A1A]"
                    }`}
                  >
                    Otro
                  </button>
                </div>

                {showCustom && (
                  <input
                    type="number"
                    placeholder="Monto mensual en pesos"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] mb-4"
                    min="5000"
                  />
                )}

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Resumen de tu aporte</p>
                  <p className="text-2xl font-bold text-[#8B1A1A]">
                    {finalAmount ? formatCLP(finalAmount) : "—"}/mes
                  </p>
                </div>

                <button
                  onClick={() => setStep("data")}
                  disabled={!finalAmount || finalAmount < 5000}
                  className="w-full bg-[#8B1A1A] hover:bg-[#7A1616] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors text-sm"
                >
                  Continuar
                </button>
              </>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); window.location.href = "/gracias"; }}>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Tus datos</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Aporte mensual:{" "}
                  <strong className="text-[#8B1A1A]">{formatCLP(finalAmount)}</strong>
                </p>
                <div className="space-y-4">
                  <input required type="text" placeholder="Nombre completo *"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1A1A]" />
                  <input required type="email" placeholder="Correo electrónico *"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1A1A]" />
                  <input type="tel" placeholder="Teléfono (opcional)"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1A1A]" />
                </div>
                <div className="flex gap-3 mt-5">
                  <button type="button" onClick={() => setStep("choose")}
                    className="flex-1 py-3.5 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50">
                    Atrás
                  </button>
                  <button type="submit"
                    className="flex-[2] bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold py-3.5 rounded-xl text-sm">
                    Activar membresía
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
