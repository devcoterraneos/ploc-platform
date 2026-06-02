"use client";

import { useState, useEffect } from "react";
import { Search, Download, RefreshCw, CheckCircle, Trash2, X } from "lucide-react";
import { formatCLP } from "@/lib/data";
import supabase from "@/lib/supabase";

type Donation = {
  id: string;
  commerce_order: string;
  campaign_id: string | null;
  campaign_name: string | null;
  donor_name: string | null;
  donor_email: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
};

const statusLabel: Record<string, string> = {
  completed:        "Pagado",
  pending:          "Pendiente",
  rejected:         "Rechazado",
  cancelled:        "Anulado",
  transfer_pending: "Por validar",
};
const statusColor: Record<string, string> = {
  completed:        "bg-green-50 text-green-700",
  pending:          "bg-yellow-50 text-yellow-700",
  rejected:         "bg-red-50 text-red-700",
  cancelled:        "bg-gray-100 text-gray-500",
  transfer_pending: "bg-amber-50 text-amber-700",
};

function getMedio(commerceOrder: string): { label: string; cls: string } {
  if (commerceOrder?.startsWith("TRANSFER-")) {
    return { label: "Transferencia", cls: "bg-blue-50 text-blue-600" };
  }
  return { label: "Flow", cls: "bg-purple-50 text-purple-600" };
}

type Tab = "completed" | "pending";

export default function DonantesAdminPage() {
  const [donations,     setDonations]     = useState<Donation[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [tab,           setTab]           = useState<Tab>("completed");
  const [marking,       setMarking]       = useState<string | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<Donation | null>(null);
  const [deleteInput,   setDeleteInput]   = useState("");
  const [deleting,      setDeleting]      = useState(false);

  async function fetchDonations() {
    setLoading(true);
    const { data } = await supabase
      .from("donations")
      .select("id,commerce_order,campaign_id,campaign_name,donor_name,donor_email,amount,status,created_at,paid_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data) setDonations(data as Donation[]);
    setLoading(false);
  }

  useEffect(() => { fetchDonations(); }, []);

  const byTab = donations.filter((d) =>
    tab === "completed"
      ? d.status === "completed"
      : d.status !== "completed"
  );

  const filtered = byTab.filter(
    (d) =>
      (d.donor_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      d.donor_email.toLowerCase().includes(search.toLowerCase()) ||
      (d.campaign_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = donations.filter((d) => d.status === "completed").length;
  const pendingCount   = donations.filter((d) => d.status !== "completed").length;
  const totalCompleted = donations.filter((d) => d.status === "completed").reduce((s, d) => s + d.amount, 0);

  async function markAsPaid(donation: Donation) {
    setMarking(donation.id);
    const { error } = await supabase
      .from("donations")
      .update({ status: "completed", paid_at: new Date().toISOString() })
      .eq("id", donation.id);
    if (error) alert("Error al actualizar: " + error.message);
    else await fetchDonations();
    setMarking(null);
  }

  async function handleDelete() {
    if (!deleteTarget || deleteInput.toLowerCase() !== "eliminar") return;
    setDeleting(true);
    try {
      await supabase.from("donations").delete().eq("id", deleteTarget.id);

      // If completed transfer, decrement campaign raised
      if (
        deleteTarget.status === "completed" &&
        deleteTarget.commerce_order?.startsWith("TRANSFER-") &&
        deleteTarget.campaign_id
      ) {
        const { data: camp } = await supabase
          .from("campaigns").select("raised").eq("id", deleteTarget.campaign_id).single();
        if (camp) {
          await supabase.from("campaigns")
            .update({ raised: Math.max(0, (camp.raised ?? 0) - deleteTarget.amount) })
            .eq("id", deleteTarget.campaign_id);
        }
      }
      await fetchDonations();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
      setDeleteInput("");
    }
  }

  function exportCSV() {
    const rows = [
      ["Orden", "Nombre", "Email", "Campaña", "Monto", "Medio", "Estado", "Fecha"],
      ...filtered.map((d) => [
        d.commerce_order,
        d.donor_name ?? "",
        d.donor_email,
        d.campaign_name ?? "",
        d.amount,
        getMedio(d.commerce_order).label,
        statusLabel[d.status] ?? d.status,
        new Date(d.created_at).toLocaleDateString("es-CL"),
      ]),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const a   = document.createElement("a");
    a.href    = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `donaciones-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const headers = [
    "Donante", "Campaña", "Medio", "Monto",
    tab === "completed" ? "Fecha pago" : "Fecha creación",
    "Estado",
    tab === "pending" ? "Acción" : "",
    "",
  ].filter(Boolean);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donantes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {completedCount} pagadas · {formatCLP(totalCompleted)} recaudado
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchDonations}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {(["completed", "pending"] as Tab[]).map((t) => {
          const count = t === "completed" ? completedCount : pendingCount;
          const active = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t === "completed" ? "Realizadas" : "Pendientes"}
              {(count > 0 || t === "completed") && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  active
                    ? t === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre, email o campaña…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A] bg-white" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Cargando...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {headers.map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const dateStr = tab === "completed"
                    ? (d.paid_at ? new Date(d.paid_at).toLocaleDateString("es-CL") : "—")
                    : new Date(d.created_at).toLocaleDateString("es-CL");
                  const medio = getMedio(d.commerce_order);

                  return (
                    <tr key={d.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{d.donor_name ?? "—"}</p>
                        <p className="text-xs text-gray-400">{d.donor_email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-xs max-w-[140px] truncate">
                        {d.campaign_name ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${medio.cls}`}>
                          {medio.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">
                        {formatCLP(d.amount)}
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                        {dateStr}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[d.status] ?? "bg-gray-100 text-gray-500"}`}>
                          {statusLabel[d.status] ?? d.status}
                        </span>
                      </td>
                      {tab === "pending" && (
                        <td className="px-5 py-4">
                          {d.status === "pending" && (
                            <button onClick={() => markAsPaid(d)} disabled={marking === d.id}
                              className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50">
                              {marking === d.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                              Marcar pagada
                            </button>
                          )}
                        </td>
                      )}
                      {/* Delete */}
                      <td className="px-3 py-4">
                        <button onClick={() => { setDeleteTarget(d); setDeleteInput(""); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                          title="Eliminar donación">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                {tab === "completed" ? "Aún no hay donaciones completadas." : "No hay donaciones pendientes."}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Eliminar donación</h3>
              <button onClick={() => { setDeleteTarget(null); setDeleteInput(""); }}
                className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
              <p className="font-semibold text-gray-800">{deleteTarget.donor_name ?? deleteTarget.donor_email}</p>
              <p className="text-gray-500">{deleteTarget.campaign_name ?? "—"} · {formatCLP(deleteTarget.amount)}</p>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              Esta acción es irreversible. Para confirmar escribe:
            </p>
            <p className="text-xs font-bold text-red-600 mb-3 tracking-wide">eliminar</p>

            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Escribe eliminar para confirmar"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-400 mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button onClick={() => { setDeleteTarget(null); setDeleteInput(""); }}
                className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput.toLowerCase() !== "eliminar" || deleting}
                className="flex-1 py-2.5 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
