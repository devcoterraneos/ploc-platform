"use client";

import { useState } from "react";
import { Save, ChevronDown, ChevronUp } from "lucide-react";
import { defaultSiteSettings } from "@/lib/data";

type SettingsSection = {
  id: string;
  label: string;
  fields: { key: string; label: string; type: "text" | "textarea" | "color" | "number" | "url" }[];
};

const sections: SettingsSection[] = [
  {
    id: "hero",
    label: "Hero principal",
    fields: [
      { key: "heroTitle", label: "Título del hero", type: "text" },
      { key: "heroHighlight", label: "Texto destacado (rojo)", type: "text" },
      { key: "heroSubtitle", label: "Subtítulo del hero", type: "text" },
      { key: "heroCommunityCount", label: "Número de personas en comunidad", type: "number" },
      { key: "heroDonarText", label: "Texto botón donar", type: "text" },
      { key: "heroProyectosText", label: "Texto botón proyectos", type: "text" },
    ],
  },
  {
    id: "branding",
    label: "Marca y colores",
    fields: [
      { key: "primaryColor", label: "Color primario", type: "color" },
      { key: "secondaryColor", label: "Color secundario", type: "color" },
      { key: "heroImageUrl", label: "URL imagen hero", type: "url" },
      { key: "footerDescription", label: "Descripción footer", type: "textarea" },
    ],
  },
  {
    id: "projects",
    label: "Sección proyectos",
    fields: [
      { key: "projectsSectionSubtitle", label: "Label superior (rojo)", type: "text" },
      { key: "projectsSectionTitle", label: "Título de la sección", type: "text" },
    ],
  },
  {
    id: "cta",
    label: "CTA final",
    fields: [
      { key: "ctaTitle", label: "Título del CTA", type: "textarea" },
      { key: "ctaSubtitle", label: "Subtítulo del CTA", type: "text" },
      { key: "ctaButtonText", label: "Texto del botón", type: "text" },
    ],
  },
  {
    id: "transparency",
    label: "Transparencia",
    fields: [
      { key: "transparencyTitle", label: "Título", type: "text" },
      { key: "transparencySubtitle", label: "Subtítulo", type: "textarea" },
    ],
  },
  {
    id: "contact",
    label: "Contacto y redes",
    fields: [
      { key: "contactAddress", label: "Dirección", type: "text" },
      { key: "contactEmail", label: "Email de contacto", type: "text" },
      { key: "contactPhone", label: "Teléfono", type: "text" },
      { key: "socialFacebook", label: "Facebook URL", type: "url" },
      { key: "socialInstagram", label: "Instagram URL", type: "url" },
      { key: "socialYoutube", label: "YouTube URL", type: "url" },
      { key: "socialLinkedin", label: "LinkedIn URL", type: "url" },
    ],
  },
  {
    id: "flow",
    label: "Configuración Flow (Pagos)",
    fields: [
      { key: "flowApiKey", label: "Flow API Key", type: "text" },
      { key: "flowSecretKey", label: "Flow Secret Key", type: "text" },
      { key: "flowReturnUrl", label: "URL de retorno", type: "url" },
      { key: "flowConfirmUrl", label: "URL de confirmación (webhook)", type: "url" },
    ],
  },
];

export default function ConfiguracionAdminPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    ...defaultSiteSettings,
    heroTitle: defaultSiteSettings.heroTitle,
    flowApiKey: "",
    flowSecretKey: "",
    flowReturnUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/gracias`,
    flowConfirmUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/api/flow/webhook`,
  } as unknown as Record<string, string>);

  const [openSections, setOpenSections] = useState<string[]>(["hero"]);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    // TODO: persist to Supabase site_settings table
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-sm text-gray-500 mt-1">
            Modifica el front-end y las integraciones sin tocar código.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all ${
            saved
              ? "bg-green-600 text-white"
              : "bg-[#8B1A1A] hover:bg-[#7A1616] text-white"
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? "¡Guardado!" : "Guardar cambios"}
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const isOpen = openSections.includes(section.id);
          return (
            <div
              key={section.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{section.label}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                  {section.id === "flow" && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                      <p className="text-xs text-yellow-700">
                        Las credenciales de Flow deben configurarse en las variables de entorno (.env.local)
                        por seguridad. Los valores aquí mostrados son para referencia.
                      </p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    {section.fields.map((field) => (
                      <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          {field.label}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            rows={3}
                            value={settings[field.key] ?? ""}
                            onChange={(e) =>
                              setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                            }
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A] resize-none"
                          />
                        ) : field.type === "color" ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={settings[field.key] ?? "#8B1A1A"}
                              onChange={(e) =>
                                setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                              }
                              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
                            />
                            <input
                              type="text"
                              value={settings[field.key] ?? ""}
                              onChange={(e) =>
                                setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                              }
                              className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A]"
                            />
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            value={settings[field.key] ?? ""}
                            onChange={(e) =>
                              setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                            }
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A]"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Supabase connection status */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h3 className="font-bold text-blue-900 mb-1">Estado de conexiones</h3>
        <div className="space-y-2 mt-3">
          {[
            { name: "Supabase", status: "pending", note: "Configura NEXT_PUBLIC_SUPABASE_URL" },
            { name: "Flow Payments", status: "pending", note: "Configura FLOW_API_KEY" },
          ].map((conn) => (
            <div key={conn.name} className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{conn.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{conn.note}</span>
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
