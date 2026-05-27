"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { featuredProjects } from "@/lib/landing-config";
import { formatCLP } from "@/lib/data";
import DonationModal, { type ProjectForModal } from "./DonationModal";

function ProjectCard({
  project,
  onDonate,
}: {
  project: (typeof featuredProjects)[0];
  onDonate: (p: ProjectForModal) => void;
}) {
  const pct = Math.min(Math.round((project.raised / project.goal) * 100), 100);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      {/* Image / gradient */}
      <div
        className="h-44 w-full relative flex items-end p-4"
        style={{ background: project.imageGradient }}
      >
        <span
          className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
          style={{
            backgroundColor: project.categoryBg,
            color: project.categoryColor,
          }}
        >
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#8B1A1A] transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1.5">
            <div
              className="h-full bg-[#8B1A1A] rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span className="font-semibold text-[#8B1A1A]">{pct}%</span>
            <span>Meta: {formatCLP(project.goal)}</span>
          </div>
        </div>

        {/* Raised */}
        <p className="text-sm font-bold text-gray-700 mb-4">
          {formatCLP(project.raised)}{" "}
          <span className="font-normal text-gray-400">recaudado</span>
        </p>

        {/* CTA */}
        <button
          onClick={() => onDonate(project)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 hover:bg-[#8B1A1A] hover:text-white border border-gray-200 hover:border-[#8B1A1A] text-sm font-semibold text-gray-700 transition-all group/btn"
        >
          Apoyar este proyecto
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default function LandingProjects() {
  const [activeProject, setActiveProject] = useState<ProjectForModal | null>(null);

  return (
    <section id="proyectos" className="py-16 lg:py-20 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase mb-2">
              Proyectos destacados
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Iniciativas que transforman
              <br className="hidden sm:block" /> nuestro territorio
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDonate={setActiveProject}
            />
          ))}
        </div>
      </div>

      {/* Donation modal */}
      <DonationModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
