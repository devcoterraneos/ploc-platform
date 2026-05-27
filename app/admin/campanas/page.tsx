"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Eye, EyeOff, RefreshCw, X, Save } from "lucide-react";
import { formatCLP } from "@/lib/data";
import supabase, { isConfigured } from "@/lib/supabase";

type Campaign = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  category: string | null;
  goal: number;
  raised: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

const emptyForm = {
  id: "", slug: "", name: "", short_description: "",
  category: "", goal: 1000000, raised: 0,
  is_featured: true, is_active: true, sort_order: 0,
};

export default function CampanasAdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editItem, setEditItem]   = useState<Partial<Campaign>>(emptyForm);
  const [isNew, setIsNew]         = useState(true);

  async function fetchCampaigns() {
    if (!isConfigured()) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("campaigns")
      .select("id,slug,name,short_description,category,goal,raised,is_featured,is_active,sort_order")
      .order("sort_order", { ascending: true });
    if (data) setCampaigns(data as Campaign[]);
    setLoading(false);
  }

  useEffect(() => { fetchCampaigns(); }, []);

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("campaigns").update({ is_active: !current, updated_at: new Date().toISOString() }).eq("id", id);
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !current } : c));
  }

  function openNew() {
    setEditItem({ ...emptyForm, id: `camp-${Date.now()}` });
    setIsNew(true);
    setShowForm(true);
  }

  function openEdit(c: Campaign) {
    setEditItem(c);
    setIsNew(false);
    setShowForm(true);
  }

  async function handleSave() {
    if (!editItem.name || !editItem.goal) return;
    setSaving(true);
    const payload = {
      ...editItem,
      slug: editItem.slug || editItem.name!.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      updated_at: new Date().toISOString(),
    };
    if (isNew) {
      await supabase.from("campaigns").insert(payload);
    } else {
      await supabase.from("campaigns").update(payload).eq("id", editItem.id!);
    }
    await fetchCampaigns();
    setSaving(false);
    setShowForm(false);
  }

  const pct = (c: Campaign) => Math.min(Math.round((c.raised / c.goal) * 100), 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {campaigns.filter((c) => c.is_active).length} activas · {campaigns.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCampaigns} className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva campaña
          </button>
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
                  {["Campaña", "Categoría", "Progreso", "Recaudado", "Estado", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === campaigns.length - 1 ? "border-0" : ""}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">/{c.slug}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {c.category ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 w-32">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full bg-[#8B1A1A] rounded-full" style={{ width: `${pct(c)}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#8B1A1A]">{pct(c)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{formatCLP(c.raised)}</p>
                      <p className="text-xs text-gray-400">de {formatCLP(c.goal)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.is_active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#8B1A1A] transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleActive(c.id, c.is_active)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#8B1A1A] transition-colors" title={c.is_active ? "Desactivar" : "Activar"}>
                          {c.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {campaigns.length === 0 && (
              <div className="text-center py-12 text-gray-400">No hay campañas todavía.</div>
            )}
          </div>
        )}
      </div>

      {/* Edit / New modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{isNew ? "Nueva campaña" : "Editar campaña"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: "name",              label: "Nombre *",          type: "text" },
                { key: "slug",              label: "Slug (URL)",         type: "text" },
                { key: "category",          label: "Categoría",          type: "text" },
                { key: "short_description", label: "Descripción corta",  type: "textarea" },
                { key: "goal",              label: "Meta ($)",           type: "number" },
                { key: "raised",            label: "Recaudado ($)",      type: "number" },
                { key: "sort_order",        label: "Orden (1, 2, 3...)", type: "number" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={2}
                      value={String((editItem as Record<string, unknown>)[f.key] ?? "")}
                      onChange={(e) => setEditItem((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A] resize-none"
                    />
                  ) : (
                    <input
                      type={f.type}
                      value={String((editItem as Record<string, unknown>)[f.key] ?? "")}
                      onChange={(e) => setEditItem((p) => ({ ...p, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A]"
                    />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!editItem.is_featured} onChange={(e) => setEditItem((p) => ({ ...p, is_featured: e.target.checked }))} className="accent-[#8B1A1A]" />
                  <span className="text-sm text-gray-600">Destacada en landing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!editItem.is_active} onChange={(e) => setEditItem((p) => ({ ...p, is_active: e.target.checked }))} className="accent-[#8B1A1A]" />
                  <span className="text-sm text-gray-600">Activa</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold bg-[#8B1A1A] text-white rounded-xl hover:bg-[#7A1616] transition-colors disabled:opacity-60">
                <Save className="w-4 h-4" />
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
