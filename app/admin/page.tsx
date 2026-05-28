"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Megaphone, TrendingUp, ArrowRight, RefreshCw } from "lucide-react";
import { formatCLP } from "@/lib/data";
import supabase from "@/lib/supabase";

type CampaignRow = {
  id: string;
  name: string;
  goal: number;
  raised: number;
  status: string;
};

type Stats = {
  totalRaised: number;
  donationsThisMonth: number;
  activeCampaigns: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats]         = useState<Stats>({ totalRaised: 0, donationsThisMonth: 0, activeCampaigns: 0 });
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading]     = useState(true);

  async function fetchData() {
    setLoading(true);

    const now   = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [donationsRes, monthRes, campaignsRes] = await Promise.all([
      supabase.from("donations").select("amount").eq("status", "completed"),
      supabase.from("donations").select("id", { count: "exact", head: true }).eq("status", "completed").gte("created_at", start),
      supabase.from("campaigns").select("id,name,goal,raised,status").eq("status", "active").order("sort_order", { ascending: true }),
    ]);

    const totalRaised = (donationsRes.data ?? []).reduce((sum, d) => sum + (d.amount ?? 0), 0);

    setStats({
      totalRaised,
      donationsThisMonth: monthRes.count ?? 0,
      activeCampaigns:    campaignsRes.data?.length ?? 0,
    });
    setCampaigns((campaignsRes.data ?? []) as CampaignRow[]);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    {
      label: "Total recaudado",
      value: formatCLP(stats.totalRaised),
      sub:   "donaciones completadas",
      icon:  TrendingUp,
      color: "text-green-600",
      bg:    "bg-green-50",
    },
    {
      label: "Donaciones este mes",
      value: String(stats.donationsThisMonth),
      sub:   new Date().toLocaleString("es-CL", { month: "long", year: "numeric" }),
      icon:  Heart,
      color: "text-[#8B1A1A]",
      bg:    "bg-red-50",
    },
    {
      label: "Campañas activas",
      value: String(stats.activeCampaigns),
      sub:   "publicadas en la landing",
      icon:  Megaphone,
      color: "text-purple-600",
      bg:    "bg-purple-50",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Resumen general de la plataforma PLOC</p>
        </div>
        <button onClick={fetchData} className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
          <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            {loading ? (
              <div className="h-8 w-24 bg-gray-100 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            )}
            <p className="text-xs font-medium text-gray-600 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Campaigns overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Campañas activas</h2>
          <Link href="/admin/campanas" className="flex items-center gap-1 text-xs font-medium text-[#8B1A1A] hover:underline">
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Cargando...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400">
            No hay campañas activas.{" "}
            <Link href="/admin/campanas" className="text-[#8B1A1A] underline">Crear una</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {campaigns.map((c) => {
              const pct = Math.min(Math.round((c.raised / c.goal) * 100), 100);
              return (
                <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-[#8B1A1A] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-[#8B1A1A] flex-shrink-0">{pct}%</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{formatCLP(c.raised)}</p>
                    <p className="text-xs text-gray-400">de {formatCLP(c.goal)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/campanas",      label: "Nueva campaña",   desc: "Crear y publicar campaña" },
          { href: "/admin/donantes",      label: "Ver donantes",    desc: "Historial de donaciones" },
          { href: "/admin/configuracion", label: "Configurar sitio",desc: "Textos, imágenes, colores" },
        ].map((action) => (
          <Link key={action.href} href={action.href}
            className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#8B1A1A]/30 hover:shadow-sm transition-all group">
            <p className="font-semibold text-gray-900 group-hover:text-[#8B1A1A] transition-colors">{action.label}</p>
            <p className="text-xs text-gray-400 mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
