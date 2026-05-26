import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { documents, defaultSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Transparencia",
  description: "Así distribuimos y usamos los fondos en la Corporación PLOC.",
};

export default function TransparenciaPage() {
  const { transparencyItems } = defaultSiteSettings;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F9FAFB] border-b border-gray-100 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase mb-3">
            Transparencia
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tu aporte se usa con responsabilidad
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
            Publicamos la distribución de fondos para que puedas ver exactamente
            cómo se usa cada peso que aportas a Puerto Octay.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Distribution */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Distribución de fondos
          </h2>
          <div className="space-y-4">
            {transparencyItems.map((item) => (
              <div key={item.id} className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  <span className="text-2xl font-bold text-[#8B1A1A]">{item.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-[#8B1A1A] rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment */}
        <div className="bg-red-50 rounded-2xl p-6 mb-12 border border-red-100">
          <h3 className="font-bold text-gray-900 mb-2">Nuestro compromiso</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            La Corporación PLOC se compromete a publicar anualmente una memoria de actividades
            y un informe de uso de fondos. Todos los aportes son gestionados con criterios de
            eficiencia, equidad y transparencia, priorizando siempre el impacto directo en la
            comunidad de Puerto Octay.
          </p>
        </div>

        {/* Documents */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Documentos disponibles
          </h2>
          <div className="space-y-3">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 hover:border-[#8B1A1A]/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#8B1A1A]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-[#8B1A1A] transition-colors">
                      {doc.title}
                    </p>
                    <p className="text-xs text-gray-400">{doc.description}</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-[#8B1A1A] transition-colors" />
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4">
            ¿Necesitas información adicional?{" "}
            <a
              href="mailto:contacto@corporacionploc.org"
              className="text-[#8B1A1A] hover:underline"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
