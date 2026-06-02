"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Users, Eye, Globe, Smartphone, Monitor, TrendingUp } from "lucide-react";

type DayRow = {
  sum: { visits: number; pageViews: number };
  dimensions: { date: string };
};
type PathRow    = { sum: { visits: number }; dimensions: { requestPath: string } };
type CountryRow = { sum: { visits: number }; dimensions: { countryName: string } };
type DeviceRow  = { sum: { visits: number }; dimensions: { deviceType: string } };

type AnalyticsData = {
  byDate:    DayRow[];
  byPath:    PathRow[];
  byCountry: CountryRow[];
  byDevice:  DeviceRow[];
  error?:    string;
};

const PERIODS = [
  { label: "7 días",  days: 7  },
  { label: "30 días", days: 30 },
];

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#8B1A1A]" />
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900 leading-none mb-1">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function BarChart({ rows }: { rows: DayRow[] }) {
  if (!rows.length) return <p className="text-sm text-gray-400 text-center py-8">Sin datos</p>;
  const max = Math.max(...rows.map(r => r.sum.visits), 1);
  return (
    <div className="flex items-end gap-1 h-28 w-full">
      {rows.map((r, i) => {
        const pct = Math.round((r.sum.visits / max) * 100);
        const label = r.dimensions.date.slice(5); // MM-DD
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-1 group">
            <div className="relative flex-1 w-full flex items-end">
              <div
                className="w-full rounded-t-sm bg-[#8B1A1A]/80 group-hover:bg-[#8B1A1A] transition-colors"
                style={{ height: `${Math.max(pct, 2)}%` }}
                title={`${r.sum.visits} visitas`}
              />
            </div>
            {rows.length <= 14 && (
              <span className="text-[9px] text-gray-400 rotate-0 leading-none">{label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TopList({ rows, valueKey, labelKey }: { rows: { sum: Record<string, number>; dimensions: Record<string, string> }[]; valueKey: string; labelKey: string }) {
  if (!rows.length) return <p className="text-sm text-gray-400 text-center py-4">Sin datos</p>;
  const max = Math.max(...rows.map(r => r.sum[valueKey] ?? 0), 1);
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => {
        const val   = r.sum[valueKey] ?? 0;
        const label = r.dimensions[labelKey] || "—";
        const pct   = Math.round((val / max) * 100);
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-700 font-medium truncate max-w-[75%]">{label}</span>
              <span className="text-gray-500 font-semibold ml-2 flex-shrink-0">{val.toLocaleString("es-CL")}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-[#8B1A1A]/70 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days,    setDays]    = useState(30);

  async function fetchData(d = days) {
    setLoading(true);
    try {
      const res  = await fetch(`/api/analytics?days=${d}`);
      const text = await res.text();
      let json: AnalyticsData;
      try {
        json = JSON.parse(text);
      } catch {
        json = { byDate: [], byPath: [], byCountry: [], byDevice: [], error: `Respuesta no válida (${res.status}): ${text.slice(0, 200)}` };
      }
      setData(json);
    } catch (err: unknown) {
      setData({ byDate: [], byPath: [], byCountry: [], byDevice: [], error: `Error de red: ${err instanceof Error ? err.message : String(err)}` });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  function changePeriod(d: number) {
    setDays(d);
    fetchData(d);
  }

  // Totals
  const totalVisits    = data?.byDate.reduce((s, r) => s + r.sum.visits, 0) ?? 0;
  const totalPageViews = data?.byPath.reduce((s, r) => s + r.sum.visits, 0) ?? 0;
  const topCountry     = data?.byCountry[0]?.dimensions?.countryName ?? "—";

  const mobileVisits  = data?.byDevice.find(r => r.dimensions.deviceType === "mobile")?.sum.visits  ?? 0;
  const desktopVisits = data?.byDevice.find(r => r.dimensions.deviceType === "desktop")?.sum.visits ?? 0;
  const totalDevices  = mobileVisits + desktopVisits || 1;
  const mobilePct     = Math.round((mobileVisits / totalDevices) * 100);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Tráfico del sitio — Cloudflare Web Analytics</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
            {PERIODS.map(p => (
              <button
                key={p.days}
                onClick={() => changePeriod(p.days)}
                className={`px-4 py-2 text-xs font-semibold transition-colors ${
                  days === p.days
                    ? "bg-[#8B1A1A] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={() => fetchData()} className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {data?.error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
          {data.error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users}     label="Visitas"      value={totalVisits.toLocaleString("es-CL")}     sub={`últimos ${days} días`} />
        <StatCard icon={Eye}       label="Páginas activas" value={data?.byPath.length ?? 0} sub="rutas con visitas" />
        <StatCard icon={Globe}     label="Top país"     value={topCountry} />
        <StatCard icon={Smartphone} label="Mobile"      value={`${mobilePct}%`} sub="del total de visitas" />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-[#8B1A1A]" />
          <h2 className="text-sm font-bold text-gray-700">Visitas diarias</h2>
        </div>
        {loading ? (
          <div className="h-28 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin text-gray-300" />
          </div>
        ) : (
          <BarChart rows={data?.byDate ?? []} />
        )}
      </div>

      {/* Bottom 3 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top páginas */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Top páginas</h2>
          {loading ? <div className="flex justify-center py-4"><RefreshCw className="w-4 h-4 animate-spin text-gray-300" /></div>
            : <TopList rows={data?.byPath as Parameters<typeof TopList>[0]["rows"] ?? []} valueKey="visits" labelKey="requestPath" />}
        </div>

        {/* Top países */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Top países</h2>
          {loading ? <div className="flex justify-center py-4"><RefreshCw className="w-4 h-4 animate-spin text-gray-300" /></div>
            : <TopList rows={data?.byCountry as Parameters<typeof TopList>[0]["rows"] ?? []} valueKey="visits" labelKey="countryName" />}
        </div>

        {/* Dispositivos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Dispositivos</h2>
          {loading ? (
            <div className="flex justify-center py-4"><RefreshCw className="w-4 h-4 animate-spin text-gray-300" /></div>
          ) : (
            <div className="space-y-4">
              {[
                { type: "mobile",  icon: Smartphone, label: "Mobile"  },
                { type: "desktop", icon: Monitor,    label: "Desktop" },
              ].map(({ type, icon: Icon, label }) => {
                const visits = data?.byDevice.find(r => r.dimensions.deviceType === type)?.sum.visits ?? 0;
                const pct    = Math.round((visits / totalDevices) * 100);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </div>
                      <span className="text-gray-500 font-semibold">{visits.toLocaleString("es-CL")} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-[#8B1A1A]/70 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {(data?.byDevice ?? [])
                .filter(r => !["mobile","desktop"].includes(r.dimensions.deviceType))
                .map(r => {
                  const pct = Math.round((r.sum.visits / totalDevices) * 100);
                  return (
                    <div key={r.dimensions.deviceType}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-700 font-medium capitalize">{r.dimensions.deviceType || "Otro"}</span>
                        <span className="text-gray-500 font-semibold">{r.sum.visits.toLocaleString("es-CL")} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-gray-300 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
