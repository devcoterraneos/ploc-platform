"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { featuredProjects } from "@/lib/landing-config";
import { formatCLP } from "@/lib/data";
import { useSettings } from "@/lib/settings-context";
import supabase, { isConfigured } from "@/lib/supabase";
import DonationModal, { type ProjectForModal } from "./DonationModal";

type Project = (typeof featuredProjects)[0];

function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-2 bg-gray-200 rounded-full mt-4" />
        <div className="h-10 bg-gray-200 rounded-xl mt-2" />
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  primaryColor,
  onDonate,
}: {
  project: Project;
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
            description: project.description ?? "",
            objective: project.objective ?? "",
            resourcesUse: project.resourcesUse ?? "",
            goal: project.goal,
            raised: project.raised,
            imageUrl: project.imageUrl,
            imageGradient: project.imageGradient ?? "",
            donationAmounts: project.donationAmounts,
            category: project.category ?? "",
            categoryColor: project.categoryColor ?? "#8B1A1A",
            categoryBg: project.categoryBg ?? "#FEF3C7",
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

// Map Supabase row → Project shape
function rowToProject(row: Record<string, unknown>): Project {
  return {
    id:             String(row.id ?? ""),
    slug:           String(row.slug ?? ""),
    category:       String(row.category ?? ""),
    categoryColor:  String(row.category_color ?? "#8B1A1A"),
    categoryBg:     String(row.category_bg ?? "#FEF3C7"),
    name:           String(row.name ?? ""),
    description:    String(row.short_description ?? ""),
    objective:      String(row.objective ?? ""),
    resourcesUse:   String(row.resources_use ?? ""),
    goal:           Number(row.goal ?? 0),
    raised:         Number(row.raised ?? 0),
    imageUrl:       row.image_url ? String(row.image_url) : "",
    imageGradient:  String(row.image_gradient ?? "linear-gradient(135deg,#8B1A1A,#B45309)"),
    donationAmounts: (row.donation_amounts as number[]) ?? [5000, 10000, 25000, 50000],
  };
}

export default function LandingProjects() {
  const [projects, setProjects] = useState<Project[]>(featuredProjects);
  const [loading, setLoading]   = useState(isConfigured());
  const [activeProject, setActiveProject] = useState<ProjectForModal | null>(null);
  const s = useSettings();

  useEffect(() => {
    if (!isConfigured()) return;

    supabase
      .from("campaigns")
      .select("*")
      .eq("status", "active")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProjects(data.map(rowToProject));
        }
        setLoading(false);
      });
  }, []);

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
          {loading
            ? [1, 2, 3].map((i) => <ProjectCardSkeleton key={i} />)
            : projects.map((project) => (
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
