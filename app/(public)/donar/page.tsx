"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, ShieldCheck } from "lucide-react";
import { allCampaigns, formatCLP } from "@/lib/data";
import { Suspense } from "react";

const AMOUNTS = [5000, 10000, 25000, 50000, 100000];

function DonarForm() {
  const params = useSearchParams();
  const campaignId = params.get("campaignId") ?? "main-2024";
  const initialAmount = Number(params.get("amount")) || 25000;

  const campaign =
    allCampaigns.find((c) => c.id === campaignId) ?? allCampaigns[0];

  const [step, setStep] = useState<"amount" | "data" | "processing">("amount");
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [donationType, setDonationType] = useState<"one_time" | "recurring">("one_time");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const finalAmount = showCustom && customAmount
    ? parseInt(customAmount, 10)
    : selectedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    // TODO: call /api/flow/create with form + finalAmount + campaign
    setTimeout(() => {
      window.location.href = "/gracias";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-[#8B1A1A]" fill="#8B1A1A" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Tu donación importa</h1>
          <p className="text-gray-500 text-sm mt-1">
            Estás apoyando: <span className="font-semibold text-gray-700">{campaign.name}</span>
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {["Monto", "Tus datos", "Pago"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i === 0 && step === "amount"
                  ? "bg-[#8B1A1A] text-white"
                  : i === 1 && step === "data"
                  ? "bg-[#8B1A1A] text-white"
                  : i === 2 && step === "processing"
                  ? "bg-[#8B1A1A] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>{i + 1}</div>
              <span className="text-xs text-gray-500 hidden sm:block">{s}</span>
              {i < 2 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {step === "amount" && (
            <>
              {/* Donation type */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setDonationType("one_time")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${
                    donationType === "one_time"
                      ? "bg-[#8B1A1A] text-white border-[#8B1A1A]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#8B1A1A]"
                  }`}
                >
                  Donación única
                </button>
                <button
                  onClick={() => setDonationType("recurring")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${
                    donationType === "recurring"
                      ? "bg-[#8B1A1A] text-white border-[#8B1A1A]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#8B1A1A]"
                  }`}
                >
                  Mensual
                </button>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-4">
                ¿Cuánto quieres {donationType === "recurring" ? "aportar cada mes" : "donar"}?
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {AMOUNTS.map((amount) => (
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
                  Otro monto
                </button>
              </div>

              {showCustom && (
                <input
                  type="number"
                  placeholder="Ingresa el monto en pesos"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] mb-4"
                  min="1000"
                />
              )}

              <button
                onClick={() => setStep("data")}
                disabled={!finalAmount || finalAmount < 1000}
                className="w-full bg-[#8B1A1A] hover:bg-[#7A1616] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors text-sm mt-2"
              >
                Continuar con {finalAmount ? formatCLP(finalAmount) : "—"}
              </button>
            </>
          )}

          {step === "data" && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Tus datos</h2>
              <p className="text-sm text-gray-500 mb-6">
                Necesitamos esta información para confirmar tu donación de{" "}
                <strong className="text-[#8B1A1A]">{formatCLP(finalAmount)}</strong>.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]"
                    placeholder="+56 9 xxxx xxxx"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep("amount")}
                  className="flex-1 py-3.5 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-2 flex-[2] bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Ir a pagar con Flow
                </button>
              </div>
            </form>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-[#8B1A1A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Procesando tu donación…</p>
              <p className="text-sm text-gray-400 mt-1">Te redirigiremos a Flow para completar el pago.</p>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Pago seguro con Flow
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#8B1A1A]" />
            Aporte transparente
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonarPage() {
  return (
    <Suspense>
      <DonarForm />
    </Suspense>
  );
}
