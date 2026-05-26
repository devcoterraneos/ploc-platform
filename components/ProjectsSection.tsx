import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Campaign } from "@/lib/types";

interface ProjectsSectionProps {
  campaigns: Campaign[];
  title?: string;
  subtitle?: string;
}

export default function ProjectsSection({
  campaigns,
  title = "Iniciativas que transforman nuestro territorio",
  subtitle = "PROYECTOS DESTACADOS",
}: ProjectsSectionProps) {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase mb-2">
              {subtitle}
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          <Link
            href="/proyectos"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#8B1A1A] hover:text-[#7A1616] transition-colors flex-shrink-0 group"
          >
            Ver todos los proyectos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <ProjectCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
}
