"use client";

import { useState, useEffect } from "react";
import { Search, Download, RefreshCw } from "lucide-react";
import { formatCLP } from "@/lib/data";
import supabase, { isConfigured } from "@/lib/supabase";

type Donation = {
  id: string;
  commerce_order: string;
  campaign_name: string | null;
  donor_name: string | null;
  donor_email: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
};

const statusLabel: Record<string, string> = {
  completed: "Pagado",
  pending:   "Pendiente",
  rejected:  "Rechazado",
  cancelled: "Anulado",
};
const statusColor: Record<string, string> = {
  completed: "bg-green-50 text-green-700",
  pending:   "bg-yellow-50 text-yellow-700",
  rejected:  "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function DonantesAdminPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  async function fetchDonations() {
    if (!isConfigured()) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("donations")
      .select("id,commerce_order,campaign_name,donor_name,donor_email,amount,status,created_at,paid_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data) setDonations(data as Donation[]);
    setLoading(false);
  }

  useEffect(() => { fetchDonations(); }, []);

  const filtered = donations.filter(
    (d) =>
      (d.donor_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      d.donor_email.toLowerCase().includes(search.toLowerCase()) ||
      (d.campaign_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalCompleted = filtered
    .filter((d) => d.status === "completed")
    .reduce((s, d) => s + d.amount, 0);

  function exportCSV() {
    const rows = [
      ["Orden", "Nombre", "Email", "Campaña", "Monto", "Estado", "Fecha"],
      ...filtered.map((d) => [
        d.commerce_order,
        d.donor_name ?? "",
        d.donor_email,
        d.campaign_name ?? "",
        d.amount,
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donantes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.filter((d) => d.status === "completed").length} pagadas ·{" "}
            {formatCLP(totalCompleted)} recaudado
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchDonations}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o campaña…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A] bg-white"
          />
        </div>
      </div>

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
                  {["Donante", "Campaña", "Monto", "Fecha", "Estado"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{d.donor_name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{d.donor_email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs max-w-[140px] truncate">
                      {d.campaign_name ?? "—"}
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">
                      {formatCLP(d.amount)}
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                      {new Date(d.created_at).toLocaleDateString("es-CL")}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[d.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {statusLabel[d.status] ?? d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                {donations.length === 0 ? "Aún no hay donaciones registradas." : "No se encontraron resultados."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
