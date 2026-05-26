"use client";

import { useState } from "react";
import { Search, UserCheck, UserX } from "lucide-react";
import { formatCLP } from "@/lib/data";

const mockMembers = [
  { id: "1", name: "Pedro Araya", email: "pedro@email.com", amount: 10000, startDate: "2024-01-15", status: "active" },
  { id: "2", name: "Claudia Morales", email: "claudia@email.com", amount: 5000, startDate: "2024-03-01", status: "active" },
  { id: "3", name: "Jorge Ibáñez", email: "jorge@email.com", amount: 20000, startDate: "2024-02-10", status: "active" },
  { id: "4", name: "Valentina Ríos", email: "vale@email.com", amount: 15000, startDate: "2024-04-20", status: "cancelled" },
  { id: "5", name: "Cristian Pinto", email: "cristian@email.com", amount: 10000, startDate: "2024-05-05", status: "active" },
];

const statusLabel: Record<string, string> = {
  active: "Activo",
  cancelled: "Cancelado",
  failed: "Fallido",
  pending: "Pendiente",
};

const statusColor: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  failed: "bg-red-50 text-red-700",
  pending: "bg-yellow-50 text-yellow-700",
};

export default function SociosAdminPage() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState(mockMembers);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = members.filter((m) => m.status === "active").length;
  const monthlyRevenue = members
    .filter((m) => m.status === "active")
    .reduce((sum, m) => sum + m.amount, 0);

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
          { label: "Socios activos", value: activeCount },
          { label: "Ingreso mensual", value: formatCLP(monthlyRevenue) },
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
                <tr
                  key={member.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                    i === filtered.length - 1 ? "border-0" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.email}</p>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900">
                    {formatCLP(member.amount)}/mes
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {new Date(member.startDate).toLocaleDateString("es-CL")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[member.status]}`}>
                      {statusLabel[member.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {member.status === "active" ? (
                        <button
                          onClick={() => setMembers((prev) =>
                            prev.map((m) => m.id === member.id ? { ...m, status: "cancelled" } : m)
                          )}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Cancelar
                        </button>
                      ) : (
                        <button
                          onClick={() => setMembers((prev) =>
                            prev.map((m) => m.id === member.id ? { ...m, status: "active" } : m)
                          )}
                          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Activar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
