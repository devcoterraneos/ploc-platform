import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { allCampaigns } from "@/lib/data";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Conoce todos los proyectos e iniciativas de la Corporación PLOC en Puerto Octay.",
};

const categories = ["Todos", "Patrimonio", "Cultura", "Medio Ambiente", "Comunidad", "Desarrollo Territorial"];

export default function ProyectosPage() {
  const activeCampaigns = allCampaigns.filter((c) => !c.isMainCampaign);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <p className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase mb-2">
            Proyectos
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Iniciativas que transforman Puerto Octay
          </h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            Cada proyecto es una apuesta concreta por el desarrollo sostenible,
            la cultura y el patrimonio de nuestra comuna.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                cat === "Todos"
                  ? "bg-[#8B1A1A] text-white border-[#8B1A1A]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCampaigns.map((campaign) => (
            <ProjectCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {activeCampaigns.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No hay proyectos activos en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
