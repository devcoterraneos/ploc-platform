"use client";

import { useState, useRef } from "react";
import { Save, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { defaultSiteSettings } from "@/lib/data";
import { persistSettings } from "@/lib/settings-context";

type FieldType = "text" | "textarea" | "color" | "number" | "url" | "toggle" | "image-upload";

type SettingsSection = {
  id: string;
  label: string;
  fields: { key: string; label: string; type: FieldType }[];
};

const sections: SettingsSection[] = [
  {
    id: "hero",
    label: "Hero principal",
    fields: [
      { key: "heroImageUrl",   label: "Imagen hero",                           type: "image-upload" },
      { key: "heroTitle",      label: "Título (usa \\n para salto de línea)",  type: "text" },
      { key: "heroHighlight",  label: "Texto destacado en color primario",     type: "text" },
      { key: "heroSubtitle",   label: "Subtítulo",                             type: "textarea" },
    ],
  },
  {
    id: "branding",
    label: "Marca y colores",
    fields: [
      { key: "logoUrl",           label: "Logo principal",              type: "image-upload" },
      { key: "primaryColor",      label: "Color primario",              type: "color" },
      { key: "footerDescription", label: "Descripción en el footer",    type: "textarea" },
    ],
  },
  {
    id: "projects",
    label: "Sección proyectos",
    fields: [
      { key: "projectsSectionSubtitle", label: "Label superior (pequeño, color primario)", type: "text" },
      { key: "projectsSectionTitle",    label: "Título de la sección",                     type: "text" },
    ],
  },
  {
    id: "contact",
    label: "Contacto y redes sociales",
    fields: [
      { key: "contactEmail",    label: "Email de contacto", type: "text" },
      { key: "contactPhone",    label: "Teléfono",          type: "text" },
      { key: "socialFacebook",  label: "Facebook URL",      type: "url" },
      { key: "socialInstagram", label: "Instagram URL",     type: "url" },
      { key: "socialYoutube",   label: "YouTube URL",       type: "url" },
      { key: "socialLinkedin",  label: "LinkedIn URL",      type: "url" },
    ],
  },
  {
    id: "visibility",
    label: "Visibilidad de secciones opcionales",
    fields: [
      { key: "showMembershipSection",   label: "Mostrar sección «Hazte socio/a»", type: "toggle" },
      { key: "showTransparencySection", label: "Mostrar sección «Transparencia»", type: "toggle" },
    ],
  },
];

export default function ConfiguracionAdminPage() {
  const [settings, setSettings] = useState<Record<string, string | boolean>>({
    ...defaultSiteSettings,
    heroTitle: defaultSiteSettings.heroTitle,
    showMembershipSection: defaultSiteSettings.showMembershipSection,
    showTransparencySection: defaultSiteSettings.showTransparencySection,
  } as unknown as Record<string, string | boolean>);

  const [openSections, setOpenSections] = useState<string[]>(["hero"]);
  const [saved, setSaved]               = useState(false);
  const [uploading, setUploading]       = useState<string | null>(null);
  const [uploadField, setUploadField]   = useState<string | null>(null);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const toggle = (id: string) =>
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleSave = async () => {
    await persistSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  async function handleImageUpload(file: File, fieldKey: string) {
    setUploading(fieldKey);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "campaign-images");
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setSettings((prev) => ({ ...prev, [fieldKey]: data.url as string }));
      } else {
        alert("Error al subir imagen: " + (data.error ?? "desconocido"));
      }
    } catch {
      alert("Error al subir imagen");
    } finally {
      setUploading(null);
      setUploadField(null);
    }
  }

  return (
    <div>
      {/* Input oculto compartido para todos los campos image-upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadField) handleImageUpload(file, uploadField);
          e.target.value = "";
        }}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-sm text-gray-500 mt-1">
            Modifica el front-end sin tocar código.
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
                  <div className="grid md:grid-cols-2 gap-4">
                    {section.fields.map((field) => {
                      const isWide =
                        field.type === "textarea" ||
                        field.type === "toggle" ||
                        field.type === "image-upload";
                      return (
                        <div key={field.key} className={isWide ? "md:col-span-2" : ""}>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            {field.label}
                          </label>

                          {field.type === "image-upload" ? (
                            <div className="space-y-3">
                              {/* Preview */}
                              {settings[field.key] && (
                                <div
                                  className={`relative w-full rounded-xl overflow-hidden border border-gray-200 ${
                                    field.key === "logoUrl"
                                      ? "h-24 bg-gray-100 flex items-center justify-center"
                                      : "h-44 bg-gray-100"
                                  }`}
                                >
                                  <img
                                    src={settings[field.key] as string}
                                    alt={field.label}
                                    className={`w-full h-full ${
                                      field.key === "logoUrl" ? "object-contain p-3" : "object-cover"
                                    }`}
                                  />
                                </div>
                              )}
                              {/* Upload button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadField(field.key);
                                  fileInputRef.current?.click();
                                }}
                                disabled={uploading !== null}
                                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                              >
                                {uploading === field.key ? (
                                  <>
                                    <span className="w-4 h-4 border-2 border-[#8B1A1A] border-t-transparent rounded-full animate-spin" />
                                    Subiendo…
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 text-gray-500" />
                                    {settings[field.key] ? "Cambiar imagen" : "Subir imagen"}
                                  </>
                                )}
                              </button>
                            </div>

                          ) : field.type === "toggle" ? (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <span className="text-sm text-gray-600">{field.label}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    [field.key]: !prev[field.key],
                                  }))
                                }
                                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                                  settings[field.key] ? "bg-[#8B1A1A]" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                    settings[field.key] ? "translate-x-5" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </div>

                          ) : field.type === "textarea" ? (
                            <textarea
                              rows={3}
                              value={(settings[field.key] as string) ?? ""}
                              onChange={(e) =>
                                setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                              }
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A] resize-none"
                            />

                          ) : field.type === "color" ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={(settings[field.key] as string) ?? "#8B1A1A"}
                                onChange={(e) =>
                                  setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                                }
                                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
                              />
                              <input
                                type="text"
                                value={(settings[field.key] as string) ?? ""}
                                onChange={(e) =>
                                  setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                                }
                                className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A]"
                              />
                            </div>

                          ) : (
                            <input
                              type={field.type === "image-upload" ? "text" : field.type}
                              value={(settings[field.key] as string) ?? ""}
                              onChange={(e) =>
                                setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                              }
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1A1A]"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
