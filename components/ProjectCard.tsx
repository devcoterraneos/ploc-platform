import Link from "next/link";
import type { Campaign } from "@/lib/types";
import { formatCLP, getProgressPercent } from "@/lib/data";

const categoryColors: Record<string, string> = {
  Patrimonio: "bg-amber-100 text-amber-800",
  Cultura: "bg-purple-100 text-purple-800",
  "Medio Ambiente": "bg-green-100 text-green-800",
  Comunidad: "bg-blue-100 text-blue-800",
  "Desarrollo Territorial": "bg-teal-100 text-teal-800",
  Educación: "bg-indigo-100 text-indigo-800",
};

interface ProjectCardProps {
  campaign: Campaign;
}

export default function ProjectCard({ campaign }: ProjectCardProps) {
  const progress = getProgressPercent(campaign.raised, campaign.goal);
  const categoryClass =
    categoryColors[campaign.category] ?? "bg-gray-100 text-gray-700";

  return (
    <Link
      href={`/proyectos/${campaign.slug}`}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-500"
          style={{
            background:
              campaign.category === "Patrimonio"
                ? "linear-gradient(135deg,#92400E,#B45309)"
                : campaign.category === "Cultura"
                ? "linear-gradient(135deg,#4C1D95,#7C3AED)"
                : "linear-gradient(135deg,#065F46,#059669)",
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${categoryClass}`}
          >
            {campaign.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-[#8B1A1A] transition-colors">
          {campaign.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 flex-1 leading-relaxed">
          {campaign.shortDescription}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-[#8B1A1A] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#8B1A1A]">
              {formatCLP(campaign.raised)} recaudado
            </span>
            <span className="text-gray-400">Meta {formatCLP(campaign.goal)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
