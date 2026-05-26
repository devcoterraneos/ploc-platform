"use client";

import { useState } from "react";
import { Plus, Edit2, Eye, EyeOff, Star } from "lucide-react";
import { allCampaigns, formatCLP, getProgressPercent } from "@/lib/data";
import type { Campaign } from "@/lib/types";

export default function CampanasAdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(allCampaigns);
  const [showForm, setShowForm] = useState(false);

  const statusLabel: Record<string, string> = {
    active: "Activa",
    paused: "Pausada",
    finished: "Finalizada",
    draft: "Borrador",
  };

  const statusColor: Record<string, string> = {
    active: "bg-green-50 text-green-700",
    paused: "bg-yellow-50 text-yellow-700",
    finished: "bg-gray-100 text-gray-500",
    draft: "bg-blue-50 text-blue-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las campañas de donación de la plataforma.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva campaña
        </button>
      </div>

      {/* Campaigns table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Campaña</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Categoría</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">Progreso</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Recaudado</th>
                <th className="text-center px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Estado</th>
                <th className="text-center px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, i) => {
                const progress = getProgressPercent(campaign.raised, campaign.goal);
                return (
                  <tr
                    key={campaign.id}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                      i === campaigns.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {campaign.isMainCampaign && (
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{campaign.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">
                            /{campaign.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {campaign.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 w-36">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-[#8B1A1A] rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#8B1A1A]">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="font-bold text-gray-900">{formatCLP(campaign.raised)}</p>
                      <p className="text-xs text-gray-400">de {formatCLP(campaign.goal)}</p>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          statusColor[campaign.status]
                        }`}
                      >
                        {statusLabel[campaign.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#8B1A1A] transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCampaigns((prev) =>
                              prev.map((c) =>
                                c.id === campaign.id
                                  ? { ...c, status: c.status === "active" ? "paused" : "active" }
                                  : c
                              )
                            );
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#8B1A1A] transition-colors"
                          title={campaign.status === "active" ? "Pausar" : "Activar"}
                        >
                          {campaign.status === "active" ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New campaign modal placeholder */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nueva campaña</h2>
            <p className="text-sm text-gray-500 mb-4">
              Completa los campos para crear una nueva campaña. La conexión con Supabase
              guardará los datos en la base de datos.
            </p>
            <div className="space-y-3">
              {["Nombre de la campaña", "Categoría", "Meta ($)", "Descripción"].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{field}</label>
                  <input
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A]"
                    placeholder={field}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 text-sm font-bold bg-[#8B1A1A] text-white rounded-xl hover:bg-[#7A1616] transition-colors"
              >
                Guardar campaña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
