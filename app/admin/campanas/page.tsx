"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, RefreshCw, X, Save, ImageIcon } from "lucide-react";
import { formatCLP } from "@/lib/data";
import supabase, { isConfigured } from "@/lib/supabase";

type Campaign = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  objective: string | null;
  resources_use: string | null;
  category: string | null;
  category_color: string | null;
  category_bg: string | null;
  goal: number;
  raised: number;
  status: string;
  sort_order: number;
  image_url: string | null;
  image_gradient: string | null;
  donation_amounts: number[] | null;
};

const emptyForm: Partial<Campaign> = {
  id: "",
  slug: "",
  name: "",
  short_description: "",
  objective: "",
  resources_use: "",
  category: "",
  category_color: "#8B1A1A",
  category_bg: "#FEF3C7",
  goal: 1000000,
  raised: 0,
  status: "draft",
  sort_order: 0,
  image_url: "",
  image_gradient: "linear-gradient(135deg,#8B1A1A,#B45309)",
  donation_amounts: [5000, 10000, 25000, 50000],
};

const STATUS: Record<string, { label: string; cls: string }> = {
  active:    { label: "Activa",    cls: "bg-green-50 text-green-700" },
  draft:     { label: "Borrador",  cls: "bg-yellow-50 text-yellow-700" },
  completed: { label: "Terminada", cls: "bg-gray-100 text-gray-500" },
};

const INPUT = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A]";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold text-[#8B1A1A] uppercase tracking-widest mb-4">{children}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function CampanasAdminPage() {
  const [campaigns, setCampaigns]           = useState<Campaign[]>([]);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [showForm, setShowForm]             = useState(false);
  const [editItem, setEditItem]             = useState<Partial<Campaign>>(emptyForm);
  const [isNew, setIsNew]                   = useState(true);
  const [imageFile, setImageFile]           = useState<File | null>(null);
  const [imagePreview, setImagePreview]     = useState<string>("");
  const [confirmDelete, setConfirmDelete]   = useState<string | null>(null);
  const [saveError, setSaveError]           = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  async function fetchCampaigns() {
    if (!isConfigured()) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("campaigns")
      .select("id,slug,name,short_description,objective,resources_use,category,category_color,category_bg,goal,raised,status,sort_order,image_url,image_gradient,donation_amounts")
      .order("sort_order", { ascending: true });
    if (data) setCampaigns(data as Campaign[]);
    setLoading(false);
  }

  useEffect(() => { fetchCampaigns(); }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function set<K extends keyof Campaign>(key: K, value: Campaign[K]) {
    setEditItem(p => ({ ...p, [key]: value }));
  }

  function openNew() {
    setEditItem({ ...emptyForm, id: `camp-${Date.now()}` });
    setIsNew(true);
    setImageFile(null);
    setImagePreview("");
    setSaveError(null);
    setShowForm(true);
  }

  function openEdit(c: Campaign) {
    setEditItem({ ...c });
    setIsNew(false);
    setImageFile(null);
    setImagePreview(c.image_url ?? "");
    setSaveError(null);
    setShowForm(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!editItem.name || !editItem.goal) return;
    setSaving(true);
    setSaveError(null);

    try {
      let imageUrl = editItem.image_url ?? "";

      if (imageFile) {
        const ext = imageFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const filename = `${editItem.id ?? Date.now()}.${ext}`;
        const { data: up, error: upErr } = await supabase.storage
          .from("campaign-images")
          .upload(filename, imageFile, { upsert: true });
        if (upErr) throw new Error(`Storage: ${upErr.message}`);
        const { data: { publicUrl } } = supabase.storage
          .from("campaign-images")
          .getPublicUrl(up.path);
        imageUrl = publicUrl;
      }

      const slug = editItem.slug?.trim() ||
        editItem.name!
          .toLowerCase()
          .normalize("NFD").replace(/[̀-ͯ]/g, "")
          .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      const payload = {
        ...editItem,
        slug,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString(),
      };

      const { error: dbErr } = isNew
        ? await supabase.from("campaigns").insert(payload)
        : await supabase.from("campaigns").update(payload).eq("id", editItem.id!);

      if (dbErr) throw new Error(dbErr.message);

      await fetchCampaigns();
      setShowForm(false);
      setImageFile(null);
      setImagePreview("");
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    await supabase.from("campaigns").delete().eq("id", id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
    setConfirmDelete(null);
  }

  const pct = (c: Campaign) => Math.min(Math.round((c.raised / c.goal) * 100), 100);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {campaigns.filter(c => c.status === "active").length} activas ·{" "}
            {campaigns.filter(c => c.status === "draft").length} borrador ·{" "}
            {campaigns.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCampaigns} className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={openNew} className="flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#7A1616] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Nueva campaña
          </button>
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
                  {["", "Campaña", "Estado", "Progreso", "Recaudado", ""].map((h, i) => (
                    <th key={i} className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => {
                  const st = STATUS[c.status] ?? STATUS.draft;
                  return (
                    <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === campaigns.length - 1 ? "border-0" : ""}`}>
                      <td className="px-4 py-3 w-14">
                        <div className="w-10 h-10 rounded-lg" style={
                          c.image_url
                            ? { backgroundImage: `url(${c.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
                            : { background: c.image_gradient ?? "linear-gradient(135deg,#8B1A1A,#B45309)" }
                        } />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">/{c.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 w-28">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full bg-[#8B1A1A] rounded-full" style={{ width: `${pct(c)}%` }} />
                          </div>
                          <span className="text-xs font-bold text-[#8B1A1A]">{pct(c)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{formatCLP(c.raised)}</p>
                        <p className="text-xs text-gray-400">de {formatCLP(c.goal)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#8B1A1A] transition-colors" title="Editar">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {campaigns.length === 0 && (
              <div className="text-center py-12 text-gray-400">No hay campañas. Crea la primera.</div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">¿Eliminar campaña?</h3>
            <p className="text-sm text-gray-500 mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900">{isNew ? "Nueva campaña" : "Editar campaña"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-7">

              {/* ── Información básica ── */}
              <section>
                <SectionTitle>Información básica</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Field label="Nombre *">
                      <input type="text" value={editItem.name ?? ""} onChange={e => set("name", e.target.value)} className={INPUT} placeholder="Nombre de la campaña" />
                    </Field>
                  </div>
                  <Field label="Slug (URL)">
                    <input type="text" value={editItem.slug ?? ""} onChange={e => set("slug", e.target.value)} className={INPUT} placeholder="auto-generado-del-nombre" />
                  </Field>
                  <Field label="Estado">
                    <select value={editItem.status ?? "draft"} onChange={e => set("status", e.target.value)} className={`${INPUT} bg-white`}>
                      <option value="active">Activa</option>
                      <option value="draft">Borrador</option>
                      <option value="completed">Terminada</option>
                    </select>
                  </Field>
                  <Field label="Categoría">
                    <input type="text" value={editItem.category ?? ""} onChange={e => set("category", e.target.value)} className={INPUT} placeholder="Ej: Patrimonio" />
                  </Field>
                  <Field label="Orden (1, 2, 3…)">
                    <input type="number" value={editItem.sort_order ?? 0} onChange={e => set("sort_order", Number(e.target.value))} className={INPUT} />
                  </Field>
                  <Field label="Color texto badge">
                    <div className="flex gap-2">
                      <input type="color" value={editItem.category_color ?? "#8B1A1A"} onChange={e => set("category_color", e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 flex-shrink-0" />
                      <input type="text" value={editItem.category_color ?? "#8B1A1A"} onChange={e => set("category_color", e.target.value)} className={INPUT} />
                    </div>
                  </Field>
                  <Field label="Color fondo badge">
                    <div className="flex gap-2">
                      <input type="color" value={editItem.category_bg ?? "#FEF3C7"} onChange={e => set("category_bg", e.target.value)} className="w-10 h10 rounded-lg border border-gray-200 cursor-pointer p-0.5 flex-shrink-0" />
                      <input type="text" value={editItem.category_bg ?? "#FEF3C7"} onChange={e => set("category_bg", e.target.value)} className={INPUT} />
                    </div>
                  </Field>
                </div>
              </section>

              {/* ── Contenido popup ── */}
              <section>
                <SectionTitle>Contenido del popup de donación</SectionTitle>
                <div className="space-y-3">
                  <Field label="Descripción corta (card de la landing)">
                    <textarea rows={2} value={editItem.short_description ?? ""} onChange={e => set("short_description", e.target.value)}
                      className={`${INPUT} resize-none`} placeholder="Una línea atractiva que resume el proyecto" />
                  </Field>
                  <Field label="¿De qué trata el proyecto?">
                    <textarea rows={3} value={editItem.objective ?? ""} onChange={e => set("objective", e.target.value)}
                      className={`${INPUT} resize-none`} placeholder="Descripción completa del objetivo, aparece en el popup" />
                  </Field>
                  <Field label="¿Para qué se usarán los recursos?">
                    <textarea rows={3} value={editItem.resources_use ?? ""} onChange={e => set("resources_use", e.target.value)}
                      className={`${INPUT} resize-none`} placeholder="Detalle del uso de los fondos recaudados" />
                  </Field>
                </div>
              </section>

              {/* ── Imagen ── */}
              <section>
                <SectionTitle>Imagen</SectionTitle>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-[#8B1A1A] transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative h-44">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" /> Cambiar foto
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Haz clic para subir una foto desde tu PC</p>
                      <p className="text-xs text-gray-300 mt-1">JPG, PNG o WebP · máx 5 MB</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
                {imageFile && (
                  <p className="text-xs text-[#8B1A1A] mt-1.5">📎 {imageFile.name} — se subirá al guardar</p>
                )}
              </section>

              {/* ── Financiero ── */}
              <section>
                <SectionTitle>Financiero</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Meta ($) *">
                    <input type="number" value={editItem.goal ?? 0} onChange={e => set("goal", Number(e.target.value))} className={INPUT} />
                  </Field>
                  <Field label="Recaudado ($)">
                    <input type="number" value={editItem.raised ?? 0} onChange={e => set("raised", Number(e.target.value))} className={INPUT} />
                  </Field>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Montos sugeridos de donación (4 botones)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(editItem.donation_amounts ?? [5000, 10000, 25000, 50000]).map((amt, idx) => (
                        <input key={idx} type="number" value={amt}
                          onChange={e => {
                            const arr = [...(editItem.donation_amounts ?? [5000, 10000, 25000, 50000])];
                            arr[idx] = Number(e.target.value);
                            set("donation_amounts", arr);
                          }}
                          className={`${INPUT} text-center`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="px-6 pb-5 pt-3 border-t border-gray-100 flex-shrink-0">
              {saveError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{saveError}</p>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold bg-[#8B1A1A] text-white rounded-xl hover:bg-[#7A1616] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? "Guardando..." : "Guardar campaña"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
