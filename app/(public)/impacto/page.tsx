import type { Metadata } from "next";
import MetricsSection from "@/components/MetricsSection";
import { defaultMetrics, featuredCampaigns, formatCLP } from "@/lib/data";

export const metadata: Metadata = {
  title: "Impacto",
  description: "Conoce el impacto real de la Corporación PLOC en Puerto Octay.",
};

export default function ImpactoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#8B1A1A] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-white/60 tracking-widest uppercase mb-3">
            Impacto
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Resultados concretos en nuestro territorio
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
            Desde 2021, la Corporación PLOC ha impulsado proyectos que transforman
            la vida cotidiana de Puerto Octay.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MetricsSection metrics={defaultMetrics} />
        </div>
      </div>

      {/* Projects with impact */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Proyectos con impacto real
        </h2>
        <div className="space-y-6">
          {featuredCampaigns.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#8B1A1A] tracking-wide uppercase">
                    {c.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-1">{c.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{c.shortDescription}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-[#8B1A1A]">
                    {formatCLP(c.raised)}
                  </p>
                  <p className="text-xs text-gray-400">de {formatCLP(c.goal)}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-[#8B1A1A] rounded-full"
                    style={{ width: `${Math.round((c.raised / c.goal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ejes section */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ejes de impacto
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Patrimonio",
                description:
                  "Restauraciones, exposiciones y circuitos que ponen en valor la historia y arquitectura de Puerto Octay.",
                highlight: "Casa Werner, Casa Schmidt, Mercado Municipal",
              },
              {
                name: "Medio Ambiente",
                description:
                  "Proyectos que cuidan el lago Llanquihue, los bosques y los ecosistemas de la comuna.",
                highlight: "Costanera, Parque Costero Sostenible",
              },
              {
                name: "Comunidad",
                description:
                  "Iniciativas culturales, educativas y sociales que fortalecen el tejido comunitario.",
                highlight: "Escuela de Música, Bibliomóvil, organizaciones vecinales",
              },
            ].map((eje) => (
              <div
                key={eje.name}
                className="bg-red-50 rounded-2xl p-6 border border-red-100"
              >
                <h3 className="font-bold text-[#8B1A1A] mb-2">{eje.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {eje.description}
                </p>
                <p className="text-xs text-gray-400 italic">{eje.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
