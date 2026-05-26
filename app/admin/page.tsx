import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Users, Megaphone, TrendingUp, ArrowRight } from "lucide-react";
import { mainCampaign, featuredCampaigns, formatCLP, getProgressPercent } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard" };

const statCards = [
  {
    label: "Total recaudado",
    value: formatCLP(18750000),
    change: "+12% este mes",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Donaciones este mes",
    value: "47",
    change: "+8 vs. mes anterior",
    icon: Heart,
    color: "text-[#8B1A1A]",
    bg: "bg-red-50",
  },
  {
    label: "Socios activos",
    value: "312",
    change: "+5 nuevos",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Campañas activas",
    value: String(featuredCampaigns.filter((c) => c.status === "active").length + 1),
    change: "Fondo principal activo",
    icon: Megaphone,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function AdminDashboardPage() {
  const allActive = [mainCampaign, ...featuredCampaigns];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general de la plataforma PLOC</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs font-medium text-gray-600 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Campaigns overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Campañas activas</h2>
          <Link
            href="/admin/campanas"
            className="flex items-center gap-1 text-xs font-medium text-[#8B1A1A] hover:underline"
          >
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {allActive.map((campaign) => {
            const progress = getProgressPercent(campaign.raised, campaign.goal);
            return (
              <div key={campaign.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {campaign.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-[#8B1A1A] rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#8B1A1A] flex-shrink-0">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    {formatCLP(campaign.raised)}
                  </p>
                  <p className="text-xs text-gray-400">
                    de {formatCLP(campaign.goal)}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    campaign.status === "active"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {campaign.status === "active" ? "Activa" : campaign.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/campanas", label: "Nueva campaña", desc: "Crear y publicar campaña" },
          { href: "/admin/donantes", label: "Ver donantes", desc: "Historial de donaciones" },
          { href: "/admin/configuracion", label: "Configurar sitio", desc: "Textos, imágenes, colores" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#8B1A1A]/30 hover:shadow-sm transition-all group"
          >
            <p className="font-semibold text-gray-900 group-hover:text-[#8B1A1A] transition-colors">
              {action.label}
            </p>
            <p className="text-xs text-gray-400 mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
