"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { featuredProjects } from "@/lib/landing-config";
import { formatCLP } from "@/lib/data";
import { useSettings } from "@/lib/settings-context";
import DonationModal, { type ProjectForModal } from "./DonationModal";

function ProjectCard({
  project,
  primaryColor,
  onDonate,
}: {
  project: (typeof featuredProjects)[0];
  primaryColor: string;
  onDonate: (p: ProjectForModal) => void;
}) {
  const pct = Math.min(Math.round((project.raised / project.goal) * 100), 100);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div
        className="h-44 w-full relative flex items-end p-4"
        style={
          project.imageUrl
            ? {
                backgroundImage: `url(${project.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: project.imageGradient }
        }
      >
        {/* Dark overlay so the badge is always legible over photos */}
        {project.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
        )}
        <span
          className="relative text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
          style={{ backgroundColor: project.categoryBg, color: project.categoryColor }}
        >
          {project.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#8B1A1A] transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="mb-4">
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: primaryColor }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span className="font-semibold" style={{ color: primaryColor }}>{pct}%</span>
            <span>Meta: {formatCLP(project.goal)}</span>
          </div>
        </div>

        <p className="text-sm font-bold text-gray-700 mb-4">
          {formatCLP(project.raised)}{" "}
          <span className="font-normal text-gray-400">recaudado</span>
        </p>

        <button
          onClick={() => onDonate({
            id: project.id,
            name: project.name,
            description: project.description,
            objective: project.objective,
            resourcesUse: project.resourcesUse,
            goal: project.goal,
            raised: project.raised,
            imageGradient: project.imageGradient,
            donationAmounts: project.donationAmounts,
            category: project.category,
            categoryColor: project.categoryColor,
            categoryBg: project.categoryBg,
          })}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-colors"
          style={{ backgroundColor: primaryColor }}
        >
          Apoyar este proyecto
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function LandingProjects() {
  const [activeProject, setActiveProject] = useState<ProjectForModal | null>(null);
  const s = useSettings();

  return (
    <section id="proyectos" className="py-16 lg:py-20 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: s.primaryColor }}
          >
            {s.projectsSectionSubtitle}
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {s.projectsSectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              primaryColor={s.primaryColor}
              onDonate={setActiveProject}
            />
          ))}
        </div>
      </div>

      <DonationModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
