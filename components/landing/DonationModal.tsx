"use client";

import { useState, useEffect } from "react";
import { X, Heart, ArrowLeft, ChevronRight, Check, Target, Wrench, TrendingUp } from "lucide-react";
import { formatCLP } from "@/lib/data";

export interface ProjectForModal {
  id: string;
  name: string;
  description: string;
  objective: string;
  resourcesUse: string;
  goal: number;
  raised: number;
  imageGradient: string;
  donationAmounts: number[];
  category: string;
  categoryColor: string;
  categoryBg: string;
}

interface DonationModalProps {
  project: ProjectForModal | null;
  onClose: () => void;
}

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 rounded-full bg-gray-100 overflow-hidden ${className}`}>
      <div
        className="h-full bg-[#8B1A1A] rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const labels = ["Proyecto", "Monto", "Datos"];
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                current > s
                  ? "bg-[#8B1A1A] text-white"
                  : current === s
                  ? "bg-[#8B1A1A] text-white ring-4 ring-red-100"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {current > s ? <Check className="w-4 h-4" /> : s}
            </div>
            <span
              className={`text-xs font-medium ${
                current >= s ? "text-[#8B1A1A]" : "text-gray-400"
              }`}
            >
              {labels[s - 1]}
            </span>
          </div>
          {s < 3 && (
            <div
              className={`w-16 h-0.5 mb-4 mx-1 transition-all ${
                current > s ? "bg-[#8B1A1A]" : "bg-gray-100"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Presentación del proyecto ────────────────────────────────────────

function InfoSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-[#8B1A1A]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function Step1({
  project,
  onNext,
}: {
  project: ProjectForModal;
  onNext: () => void;
}) {
  const pct = Math.min(Math.round((project.raised / project.goal) * 100), 100);
  const remaining = project.goal - project.raised;

  return (
    <div>
      {/* Project header: circular image + title */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="flex-shrink-0 w-16 h-16 rounded-full shadow-md ring-2 ring-white"
          style={{ background: project.imageGradient }}
        />
        <div className="min-w-0">
          <span
            className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5"
            style={{ backgroundColor: project.categoryBg, color: project.categoryColor }}
          >
            {project.category}
          </span>
          <h2 className="text-base font-bold text-gray-900 leading-tight">{project.name}</h2>
        </div>
      </div>

      {/* Info sections */}
      <div className="bg-gray-50/70 rounded-2xl border border-gray-100 px-4 mb-6 divide-y divide-gray-100">
        <InfoSection
          icon={<Target className="w-4 h-4" />}
          title="¿Cuál es el Objetivo?"
        >
          {project.objective}
        </InfoSection>

        <InfoSection
          icon={<Wrench className="w-4 h-4" />}
          title="¿En qué se ocuparán los recursos?"
        >
          {project.resourcesUse}
        </InfoSection>

        <InfoSection
          icon={<TrendingUp className="w-4 h-4" />}
          title="¿Cuánto falta?"
        >
          <span className="font-bold text-[#8B1A1A]">{formatCLP(remaining)}</span>{" "}
          para alcanzar la meta de {formatCLP(project.goal)}
          <ProgressBar value={pct} className="mt-2.5" />
          <span className="text-xs text-gray-400 mt-1 block">
            {formatCLP(project.raised)} recaudado · {pct}% completado
          </span>
        </InfoSection>
      </div>

      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm shadow-red-900/20"
      >
        <Heart className="w-4 h-4 fill-white" />
        Quiero apoyar este proyecto
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Step 2: Elegir monto ─────────────────────────────────────────────────────

function Step2({
  project,
  selected,
  custom,
  onSelect,
  onCustom,
  onBack,
  onNext,
}: {
  project: ProjectForModal;
  selected: number | null;
  custom: string;
  onSelect: (a: number | null) => void;
  onCustom: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const hasAmount = selected !== null || (custom.replace(/\D/g, "") !== "" && parseInt(custom.replace(/\D/g, ""), 10) > 0);

  function formatInput(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("es-CL").format(parseInt(digits, 10));
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Elige tu aporte</h2>
      <p className="text-sm text-gray-500 mb-5">
        Para:{" "}
        <span className="font-semibold text-gray-700">{project.name}</span>
      </p>

      {/* Suggested amounts */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {project.donationAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => { onSelect(amt); onCustom(""); }}
            className={`py-3.5 rounded-xl border-2 text-sm font-bold transition-all ${
              selected === amt
                ? "border-[#8B1A1A] bg-red-50 text-[#8B1A1A]"
                : "border-gray-200 text-gray-700 hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
            }`}
          >
            {formatCLP(amt)}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Otro monto"
          value={custom}
          onChange={(e) => {
            onCustom(formatInput(e.target.value));
            onSelect(null);
          }}
          className={`w-full pl-8 pr-4 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all outline-none ${
            custom && selected === null
              ? "border-[#8B1A1A] bg-red-50 text-[#8B1A1A]"
              : "border-gray-200 text-gray-700 focus:border-[#8B1A1A]"
          }`}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <button
          onClick={onNext}
          disabled={!hasAmount}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            hasAmount
              ? "bg-[#8B1A1A] hover:bg-[#7A1616] text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Datos del donante ─────────────────────────────────────────────────

function Step3({
  project,
  amount,
  form,
  onChange,
  onBack,
}: {
  project: ProjectForModal;
  amount: number;
  form: { name: string; email: string; phone: string; newsletter: boolean };
  onChange: (f: Partial<typeof form>) => void;
  onBack: () => void;
}) {
  const isValid = form.name.trim().length >= 2 && form.email.includes("@");

  function handleFlowClick() {
    if (!isValid) return;
    // TODO: conectar con /api/donate → Flow payment
    window.location.href = "/gracias";
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Tus datos</h2>
      <p className="text-sm text-gray-500 mb-5">
        Para procesar tu donación necesitamos estos datos.
      </p>

      {/* Form */}
      <div className="flex flex-col gap-3 mb-5">
        <input
          type="text"
          placeholder="Tu nombre completo *"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B1A1A] text-sm outline-none transition-colors"
        />
        <input
          type="email"
          placeholder="Tu email *"
          value={form.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B1A1A] text-sm outline-none transition-colors"
        />
        <input
          type="tel"
          placeholder="Teléfono (opcional)"
          value={form.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B1A1A] text-sm outline-none transition-colors"
        />
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.newsletter}
            onChange={(e) => onChange({ newsletter: e.target.checked })}
            className="mt-0.5 w-4 h-4 accent-[#8B1A1A] cursor-pointer"
          />
          <span className="text-xs text-gray-500 leading-relaxed">
            Quiero recibir novedades de este proyecto
          </span>
        </label>
      </div>

      {/* Donation summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
          Resumen de donación
        </p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 truncate max-w-[55%]">{project.name}</span>
          <span className="font-bold text-[#8B1A1A]">{formatCLP(amount)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <button
          onClick={handleFlowClick}
          disabled={!isValid}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            isValid
              ? "bg-[#8B1A1A] hover:bg-[#7A1616] text-white shadow-lg shadow-red-900/25"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          Ir a Donar con Flow
        </button>
      </div>
    </div>
  );
}

// ─── Modal wrapper ─────────────────────────────────────────────────────────────

export default function DonationModal({ project, onClose }: DonationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    newsletter: true,
  });

  // Reset on open
  useEffect(() => {
    if (project) {
      setStep(1);
      setSelectedAmount(null);
      setCustomAmount("");
      setForm({ name: "", email: "", phone: "", newsletter: true });
    }
  }, [project]);

  // Lock body scroll
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  if (!project) return null;

  const donationAmount =
    selectedAmount ??
    (customAmount.replace(/\D/g, "") !== ""
      ? parseInt(customAmount.replace(/\D/g, ""), 10)
      : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="p-6 pt-5">
          <StepIndicator current={step} />

          {step === 1 && (
            <Step1 project={project} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <Step2
              project={project}
              selected={selectedAmount}
              custom={customAmount}
              onSelect={setSelectedAmount}
              onCustom={setCustomAmount}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3
              project={project}
              amount={donationAmount}
              form={form}
              onChange={(f) => setForm((prev) => ({ ...prev, ...f }))}
              onBack={() => setStep(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
