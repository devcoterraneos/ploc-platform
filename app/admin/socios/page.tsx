"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { formatCLP } from "@/lib/data";

type Member = {
  id: string;
  name: string;
  email: string;
  amount: number;
  startDate: string;
  status: string;
};

const statusLabel: Record<string, string> = {
  active:    "Activo",
  cancelled: "Cancelado",
  failed:    "Fallido",
  pending:   "Pendiente",
};

const statusColor: Record<string, string> = {
  active:    "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  failed:    "bg-red-50 text-red-700",
  pending:   "bg-yellow-50 text-yellow-700",
};

export default function SociosAdminPage() {
  const [search, setSearch] = useState("");
  const members: Member[]   = []; // será cargado desde Supabase cuando se implemente

  const filtered       = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );
  const activeCount    = members.filter((m) => m.status === "active").length;
  const monthlyRevenue = members.filter((m) => m.status === "active").reduce((s, m) => s + m.amount, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Socios</h1>
        <p className="text-sm text-gray-500 mt-1">
          {activeCount} socios activos · {formatCLP(monthlyRevenue)}/mes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Socios activos",   value: activeCount },
          { label: "Ingreso mensual",  value: formatCLP(monthlyRevenue) },
          { label: "Proyección anual", value: formatCLP(monthlyRevenue * 12) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar socio…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A] bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users className="w-8 h-8 mb-3 text-gray-200" />
            <p className="text-sm font-medium">No hay socios registrados</p>
            <p className="text-xs mt-1">Los socios aparecerán aquí cuando se implemente la suscripción</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Socio", "Monto mensual", "Desde", "Estado", "Acciones"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((member, i) => (
                  <tr key={member.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">{formatCLP(member.amount)}/mes</td>
                    <td className="px-5 py-4 text-xs text-gray-500">{new Date(member.startDate).toLocaleDateString("es-CL")}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[member.status]}`}>
                        {statusLabel[member.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
