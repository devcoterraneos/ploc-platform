"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Heart, ArrowLeft, ChevronRight, Check, Wrench, CreditCard, Building2, Copy, CheckCheck } from "lucide-react";
import { formatCLP } from "@/lib/data";
import { useSettings } from "@/lib/settings-context";

export interface ProjectForModal {
  id: string;
  name: string;
  description: string;
  objective: string;
  resourcesUse: string;
  goal: number;
  raised: number;
  imageUrl?: string;
  imageGradient: string;
  donationAmounts: number[];
  category: string;
  categoryColor: string;
  categoryBg: string;
}

interface DonationModalProps {
  project: ProjectForModal | null;
  onClose: () => void;
  initialStep?: 1 | 2;
}

type PayMethod = "card" | "transfer" | null;

// ─── Bank details ─────────────────────────────────────────────────────────────

const BANK_LINES = [
  "Corporación Plan Desarrollo Integrado Puerto Octay",
  "RUT: 65.165.003-8",
  "Cuenta Corriente",
  "N° 2680467305",
  "Banco de Chile",
  "apola@corporacionploc.org",
];
const BANK_TEXT = BANK_LINES.join("\n");

// ─── Shared helpers ────────────────────────────────────────────────────────────

function ProgressBar({ value, color, className = "" }: { value: number; color: string; className?: string }) {
  return (
    <div className={`h-2 rounded-full bg-gray-100 overflow-hidden ${className}`}>
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

function StepIndicator({ current, twoStep = false, color }: { current: 1 | 2 | 3; twoStep?: boolean; color: string }) {
  if (twoStep) {
    const display = current - 1;
    const labels  = ["Monto", "Datos"];
    return (
      <div className="flex items-center justify-center gap-0 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={display >= s
                  ? { backgroundColor: color, color: "#fff", boxShadow: display === s ? `0 0 0 4px ${color}25` : "none" }
                  : { backgroundColor: "#f3f4f6", color: "#9ca3af" }}
              >
                {display > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className="text-xs font-medium" style={{ color: display >= s ? color : "#9ca3af" }}>
                {labels[s - 1]}
              </span>
            </div>
            {s < 2 && (
              <div className="w-16 h-0.5 mb-4 mx-1 transition-all" style={{ backgroundColor: display > s ? color : "#f3f4f6" }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  const labels = ["Proyecto", "Monto", "Datos"];
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={current >= s
                ? { backgroundColor: color, color: "#fff", boxShadow: current === s ? `0 0 0 4px ${color}25` : "none" }
                : { backgroundColor: "#f3f4f6", color: "#9ca3af" }}
            >
              {current > s ? <Check className="w-4 h-4" /> : s}
            </div>
            <span className="text-xs font-medium" style={{ color: current >= s ? color : "#9ca3af" }}>
              {labels[s - 1]}
            </span>
          </div>
          {s < 3 && (
            <div className="w-16 h-0.5 mb-4 mx-1 transition-all" style={{ backgroundColor: current > s ? color : "#f3f4f6" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function InfoSection({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center" style={{ color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{title}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

// ─── Step 0: Método de pago ────────────────────────────────────────────────────

function StepMethod({ color, onSelect }: { color: string; onSelect: (m: "card" | "transfer") => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">¿Cómo quieres donar?</h2>
      <p className="text-sm text-gray-400 text-center mb-8">Elige tu método de pago preferido</p>

      <div className="flex flex-col gap-3">
        {/* Tarjeta */}
        <button
          onClick={() => onSelect("card")}
          className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-current transition-all text-left"
          style={{ ["--hover-color" as string]: color }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#f3f4f6")}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-base">Con tarjeta</p>
            <p className="text-sm text-gray-400 mt-0.5">Débito, crédito o prepago · Vía Flow</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
        </button>

        {/* Transferencia */}
        <button
          onClick={() => onSelect("transfer")}
          className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-current transition-all text-left"
          onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#f3f4f6")}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <Building2 className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-base">Via transferencia</p>
            <p className="text-sm text-gray-400 mt-0.5">Transferencia bancaria directa</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

// ─── Step Transfer: Datos bancarios ───────────────────────────────────────────

function StepTransfer({ color, onBack }: { color: string; onBack: () => void }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(BANK_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = BANK_TEXT;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Datos para transferencia</h2>
      <p className="text-sm text-gray-400 mb-5">Copia los datos y pégalos en tu app bancaria</p>

      {/* Bank data card */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 mb-4">
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Nombre</p>
            <p className="text-sm font-semibold text-gray-800 leading-snug">
              Corporación Plan Desarrollo Integrado Puerto Octay
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">RUT</p>
            <p className="text-sm font-semibold text-gray-800">65.165.003-8</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Tipo de cuenta</p>
            <p className="text-sm font-semibold text-gray-800">Cuenta Corriente</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Número de cuenta</p>
            <p className="text-sm font-semibold text-gray-800">2680467305</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Banco</p>
            <p className="text-sm font-semibold text-gray-800">Banco de Chile</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Correo</p>
            <p className="text-sm font-semibold text-gray-800">apola@corporacionploc.org</p>
          </div>
        </div>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all text-sm mb-4 text-white"
        style={{ backgroundColor: copied ? "#22c55e" : color }}
      >
        {copied ? (
          <>
            <CheckCheck className="w-4 h-4" />
            ¡Datos copiados!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copiar datos
          </>
        )}
      </button>

      {/* Note */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
        <p className="text-xs text-amber-700 leading-relaxed text-center">
          🕐 Al final del día actualizaremos el cómputo de la campaña con tu aporte.
        </p>
      </div>

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a métodos de pago
      </button>
    </div>
  );
}

// ─── Step 1: Presentación del proyecto ────────────────────────────────────────

function Step1({ project, color, onNext }: { project: ProjectForModal; color: string; onNext: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div
          className="flex-shrink-0 w-16 h-16 rounded-full shadow-md ring-2 ring-white ring-offset-1"
          style={project.imageUrl
            ? { backgroundImage: `url(${project.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: project.imageGradient }}
        />
        <div className="min-w-0">
          <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5"
            style={{ backgroundColor: project.categoryBg, color: project.categoryColor }}>
            {project.category}
          </span>
          <h2 className="text-base font-bold text-gray-900 leading-tight">{project.name}</h2>
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{project.description}</p>
      )}

      <div className="bg-gray-50/70 rounded-2xl border border-gray-100 px-4 mb-6">
        <InfoSection icon={<Wrench className="w-4 h-4" />} title="¿En qué se ocuparán los recursos?" color={color}>
          {project.resourcesUse}
        </InfoSection>
      </div>

      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
        style={{ backgroundColor: color }}
      >
        <Heart className="w-4 h-4 fill-white" />
        Quiero apoyar este proyecto
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Step 2: Elegir monto ─────────────────────────────────────────────────────

function Step2({ project, selected, custom, color, onSelect, onCustom, onBack, onNext }: {
  project: ProjectForModal;
  selected: number | null;
  custom: string;
  color: string;
  onSelect: (a: number | null) => void;
  onCustom: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const hasAmount = selected !== null || (custom.replace(/\D/g, "") !== "" && parseInt(custom.replace(/\D/g, ""), 10) >= 500);

  function formatInput(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("es-CL").format(parseInt(digits, 10));
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Elige tu aporte</h2>
      <p className="text-sm text-gray-500 mb-5">
        Para: <span className="font-semibold text-gray-700">{project.name}</span>
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {project.donationAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => { onSelect(amt); onCustom(""); }}
            className="py-3.5 rounded-xl border-2 text-sm font-bold transition-all"
            style={selected === amt
              ? { borderColor: color, backgroundColor: `${color}12`, color }
              : { borderColor: "#e5e7eb", color: "#374151" }}
          >
            {formatCLP(amt)}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">$</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Otro monto"
          value={custom}
          onChange={(e) => { onCustom(formatInput(e.target.value)); onSelect(null); }}
          className="w-full pl-8 pr-4 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all outline-none"
          style={custom && selected === null
            ? { borderColor: color, backgroundColor: `${color}12`, color }
            : { borderColor: "#e5e7eb", color: "#374151" }}
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
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
          style={hasAmount ? { backgroundColor: color, color: "#fff" } : { backgroundColor: "#f3f4f6", color: "#9ca3af" }}
        >
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Datos del donante ─────────────────────────────────────────────────

function Step3({ project, amount, color, form, onChange, onBack }: {
  project: ProjectForModal;
  amount: number;
  color: string;
  form: { name: string; email: string; phone: string; newsletter: boolean };
  onChange: (f: Partial<typeof form>) => void;
  onBack: () => void;
}) {
  const isValid = form.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFlowClick = useCallback(async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/flow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          campaignId:   project.id,
          campaignName: project.name,
          donorName:    form.name,
          donorEmail:   form.email,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.redirectUrl) {
        setError(data.error ?? "Error al conectar con el sistema de pago. Intenta de nuevo.");
        setLoading(false);
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setError("No se pudo conectar con el sistema de pago. Revisa tu conexión.");
      setLoading(false);
    }
  }, [isValid, loading, amount, project, form]);

  const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none transition-colors focus:border-gray-400";

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Tus datos</h2>
      <p className="text-sm text-gray-500 mb-5">Para procesar tu donación necesitamos estos datos.</p>

      <div className="flex flex-col gap-3 mb-5">
        <input type="text" placeholder="Tu nombre completo *" value={form.name}
          onChange={(e) => onChange({ name: e.target.value })} className={inputCls} />
        <input type="email" placeholder="Tu email *" value={form.email}
          onChange={(e) => onChange({ email: e.target.value })} className={inputCls} />
        <input type="tel" placeholder="Teléfono (opcional)" value={form.phone}
          onChange={(e) => onChange({ phone: e.target.value })} className={inputCls} />
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.newsletter}
            onChange={(e) => onChange({ newsletter: e.target.checked })}
            className="mt-0.5 w-4 h-4 cursor-pointer" style={{ accentColor: color }} />
          <span className="text-xs text-gray-500 leading-relaxed">Quiero recibir novedades de este proyecto</span>
        </label>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Resumen de donación</p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 truncate max-w-[55%]">{project.name}</span>
          <span className="font-bold" style={{ color }}>{formatCLP(amount)}</span>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">{error}</p>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} disabled={loading}
          className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <button onClick={handleFlowClick} disabled={!isValid || loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
          style={isValid && !loading ? { backgroundColor: color, color: "#fff" } : { backgroundColor: "#f3f4f6", color: "#9ca3af" }}>
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Conectando con Flow...
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 fill-current" />
              Ir a Donar con Flow
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Modal wrapper ─────────────────────────────────────────────────────────────

export default function DonationModal({ project, onClose, initialStep = 1 }: DonationModalProps) {
  const { primaryColor } = useSettings();
  const twoStep = initialStep === 2;

  const [method, setMethod]             = useState<PayMethod>(null);
  const [step, setStep]                 = useState<1 | 2 | 3>(initialStep);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm]                 = useState({ name: "", email: "", phone: "", newsletter: true });

  // Reset everything when modal opens/closes
  useEffect(() => {
    if (project) {
      setMethod(null);
      setStep(initialStep);
      setSelectedAmount(null);
      setCustomAmount("");
      setForm({ name: "", email: "", phone: "", newsletter: true });
    }
  }, [project, initialStep]);

  useEffect(() => {
    document.body.style.overflow = project ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  if (!project) return null;

  const donationAmount =
    selectedAmount ??
    (customAmount.replace(/\D/g, "") !== "" ? parseInt(customAmount.replace(/\D/g, ""), 10) : 0);

  // What the back button does on step 2 (amount)
  function handleStep2Back() {
    if (twoStep) {
      // came from campaign page: go back to method selector
      setMethod(null);
    } else {
      // came from landing: go back to project info
      setStep(1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Cerrar">
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="p-6 pt-5">

          {/* ── No method chosen yet: show selector ── */}
          {method === null && (
            <StepMethod color={primaryColor} onSelect={setMethod} />
          )}

          {/* ── Transfer flow ── */}
          {method === "transfer" && (
            <StepTransfer color={primaryColor} onBack={() => setMethod(null)} />
          )}

          {/* ── Card flow ── */}
          {method === "card" && (
            <>
              <StepIndicator current={step} twoStep={twoStep} color={primaryColor} />

              {step === 1 && (
                <Step1 project={project} color={primaryColor} onNext={() => setStep(2)} />
              )}
              {step === 2 && (
                <Step2
                  project={project}
                  selected={selectedAmount}
                  custom={customAmount}
                  color={primaryColor}
                  onSelect={setSelectedAmount}
                  onCustom={setCustomAmount}
                  onBack={handleStep2Back}
                  onNext={() => setStep(3)}
                />
              )}
              {step === 3 && (
                <Step3
                  project={project}
                  amount={donationAmount}
                  color={primaryColor}
                  form={form}
                  onChange={(f) => setForm((prev) => ({ ...prev, ...f }))}
                  onBack={() => setStep(2)}
                />
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
