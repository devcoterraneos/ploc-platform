"use client";

import { useState } from "react";
import { Search, Download, Filter } from "lucide-react";
import { formatCLP } from "@/lib/data";

// Mock data — replace with Supabase query
const mockDonors = [
  { id: "1", name: "Carolina Fernández", email: "carolina@email.com", campaign: "Fondo Comunidad PLOC", amount: 25000, date: "2024-11-15", method: "Flow", status: "paid", type: "one_time" },
  { id: "2", name: "Rodrigo Muñoz", email: "rodrigo@email.com", campaign: "Ruta Patrimonial", amount: 10000, date: "2024-11-14", method: "Flow", status: "paid", type: "recurring" },
  { id: "3", name: "Ana Torres", email: "ana.t@email.com", campaign: "Escuela de Música", amount: 50000, date: "2024-11-13", method: "Flow", status: "paid", type: "one_time" },
  { id: "4", name: "Luis Vera", email: "luis.v@email.com", campaign: "Fondo Comunidad PLOC", amount: 15000, date: "2024-11-12", method: "Flow", status: "pending", type: "one_time" },
  { id: "5", name: "María Soto", email: "m.soto@email.com", campaign: "Parque Costero", amount: 25000, date: "2024-11-10", method: "Flow", status: "paid", type: "recurring" },
];

const statusLabel: Record<string, string> = { paid: "Pagado", pending: "Pendiente", failed: "Fallido" };
const statusColor: Record<string, string> = {
  paid: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  failed: "bg-red-50 text-red-700",
};

export default function DonantesAdminPage() {
  const [search, setSearch] = useState("");

  const filtered = mockDonors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donantes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} donaciones · {formatCLP(total)} total
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A] bg-white"
          />
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Donante", "Campaña", "Monto", "Fecha", "Tipo", "Estado"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((donor, i) => (
                <tr
                  key={donor.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                    i === filtered.length - 1 ? "border-0" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{donor.name}</p>
                    <p className="text-xs text-gray-400">{donor.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs max-w-[140px] truncate">
                    {donor.campaign}
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">
                    {formatCLP(donor.amount)}
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                    {new Date(donor.date).toLocaleDateString("es-CL")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      donor.type === "recurring" ? "bg-purple-50 text-purple-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {donor.type === "recurring" ? "Recurrente" : "Única"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[donor.status]}`}>
                      {statusLabel[donor.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
