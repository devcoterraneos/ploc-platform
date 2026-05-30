"use client";

import { useState, useEffect } from "react";
import { Plus, X, Save, RefreshCw, CheckCircle, ArrowDownToLine } from "lucide-react";
import { formatCLP } from "@/lib/data";
import supabase, { isConfigured } from "@/lib/supabase";

type Campaign = { id: string; name: string };

type Transfer = {
  id: string;
  donor_name: string | null;
  donor_email: string | null;
  amount: number;
  campaign_name: string | null;
  payment_date: string | null;
  paid_at: string | null;
  flow_raw: { source?: string; reference?: string } | null;
};

const emptyForm = {
  campaign_id:   "",
  campaign_name: "",
  donor_name:    "",
  donor_email:   "",
  amount:        "" as string | number,
  payment_date:  new Date().toISOString().split("T")[0],
  reference:     "",
};

const INPUT = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A]";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function TransferenciasPage() {
  const [campaigns, setCampaigns]   = useState<Campaign[]>([]);
  const [transfers, setTransfers]   = useState<Transfer[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState<string | null>(null);
  const [saved, setSaved]           = useState(false);
  const [form, setForm]             = useState({ ...emptyForm });

  function f<K extends keyof typeof emptyForm>(key: K, value: typeof emptyForm[K]) {
    setForm(p => ({ ...p, [key]: value }));
  }

  // ── Load campaigns + recent manual transfers ──────────────────────────────
  async function fetchData() {
    if (!isConfigured()) { setLoading(false); return; }
    setLoading(true);

    const [{ data: camps }, { data: txs }] = await Promise.all([
      supabase.from("campaigns").select("id,name").eq("status", "active").order("sort_order"),
      supabase
        .from("donations")
        .select("id,donor_name,donor_email,amount,campaign_name,payment_date,paid_at,flow_raw")
        .like("commerce_order", "MANUAL-%")
        .order("paid_at", { ascending: false })
        .limit(50),
    ]);

    if (camps) setCampaigns(camps);
    if (txs)   setTransfers(txs as Transfer[]);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    const amount = Number(String(form.amount).replace(/\D/g, ""));
    if (!form.campaign_id || !form.donor_name.trim() || !amount) return;

    setSaving(true);
    setSaveError(null);

    try {
      const commerceOrder = `MANUAL-${Date.now()}`;
      const camp = campaigns.find(c => c.id === form.campaign_id);

      // 1. Insert donation
      const { error: insErr } = await supabase.from("donations").insert({
        commerce_order: commerceOrder,
        campaign_id:    form.campaign_id,
        campaign_name:  camp?.name ?? "",
        donor_name:     form.donor_name.trim(),
        donor_email:    form.donor_email.trim() || null,
        amount,
        status:         "completed",
        payment_date:   form.payment_date,
        paid_at:        new Date(form.payment_date).toISOString(),
        flow_raw:       { source: "manual_transfer", reference: form.reference.trim() || null },
      });
      if (insErr) throw new Error(insErr.message);

      // 2. Increment campaign raised
      const { error: updErr } = await supabase.rpc("increment_raised", {
        p_campaign_id: form.campaign_id,
        p_amount:      amount,
      });
      // If RPC doesn't exist yet, fall back to a manual read+write
      if (updErr) {
        const { data: campData } = await supabase
          .from("campaigns").select("raised").eq("id", form.campaign_id).single();
        if (campData) {
          await supabase
            .from("campaigns")
            .update({ raised: (campData.raised ?? 0) + amount })
            .eq("id", form.campaign_id);
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setForm({ ...emptyForm, payment_date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
      await fetchData();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  function formatInput(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("es-CL").format(parseInt(digits, 10));
  }

  const isValid = !!form.campaign_id && !!form.donor_name.trim() &&
    Number(String(form.amount).replace(/\D/g, "")) >= 1;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transferencias manuales</h1>
          <p className="text-sm text-gray-500 mt-1">
            Registra donaciones recibidas por transferencia bancaria
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => { setShowForm(true); setSaveError(null); }}
            className="flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Registrar transferencia
          </button>
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-4">
          <CheckCircle className="w-4 h-4" />
          Transferencia registrada y cómputo actualizado correctamente.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Cargando...
          </div>
        ) : transfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <ArrowDownToLine className="w-8 h-8 text-gray-200" />
            <p className="text-sm">No hay transferencias manuales registradas aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Fecha", "Donante", "Campaña", "Monto", "Referencia"].map((h, i) => (
                    <th key={i} className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transfers.map((t, i) => (
                  <tr key={t.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === transfers.length - 1 ? "border-0" : ""}`}>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {t.payment_date
                        ? new Date(t.payment_date).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{t.donor_name ?? "—"}</p>
                      {t.donor_email && <p className="text-xs text-gray-400">{t.donor_email}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.campaign_name ?? "—"}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatCLP(t.amount)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {(t.flow_raw as { reference?: string } | null)?.reference ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900">Registrar transferencia</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

              <Field label="Campaña" required>
                <select
                  value={form.campaign_id}
                  onChange={e => {
                    const camp = campaigns.find(c => c.id === e.target.value);
                    f("campaign_id", e.target.value);
                    f("campaign_name", camp?.name ?? "");
                  }}
                  className={`${INPUT} bg-white`}
                >
                  <option value="">— Selecciona una campaña —</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Nombre del donante" required>
                <input
                  type="text"
                  value={form.donor_name}
                  onChange={e => f("donor_name", e.target.value)}
                  className={INPUT}
                  placeholder="Nombre completo"
                />
              </Field>

              <Field label="Email (opcional)">
                <input
                  type="email"
                  value={form.donor_email}
                  onChange={e => f("donor_email", e.target.value)}
                  className={INPUT}
                  placeholder="correo@ejemplo.com"
                />
              </Field>

              <Field label="Monto ($)" required>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.amount}
                    onChange={e => f("amount", formatInput(e.target.value))}
                    className={`${INPUT} pl-7`}
                    placeholder="0"
                  />
                </div>
              </Field>

              <Field label="Fecha de transferencia" required>
                <input
                  type="date"
                  value={form.payment_date}
                  onChange={e => f("payment_date", e.target.value)}
                  className={INPUT}
                />
              </Field>

              <Field label="Referencia / N° comprobante (opcional)">
                <input
                  type="text"
                  value={form.reference}
                  onChange={e => f("reference", e.target.value)}
                  className={INPUT}
                  placeholder="Ej: 123456789 / Banco de Chile"
                />
              </Field>

            </div>

            {/* Footer */}
            <div className="px-6 pb-5 pt-3 border-t border-gray-100 flex-shrink-0">
              {saveError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{saveError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isValid || saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold bg-[#8B1A1A] text-white rounded-xl hover:bg-[#7A1616] transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Guardando..." : "Registrar"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
