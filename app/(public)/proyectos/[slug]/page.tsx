import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import ActiveCampaignCard from "@/components/ActiveCampaignCard";
import { allCampaigns, formatCLP, getProgressPercent } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allCampaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = allCampaigns.find((c) => c.slug === slug);
  if (!campaign) return { title: "Proyecto no encontrado" };
  return { title: campaign.name, description: campaign.shortDescription };
}

export default async function ProyectoDetailPage({ params }: Props) {
  const { slug } = await params;
  const campaign = allCampaigns.find((c) => c.slug === slug);
  if (!campaign) notFound();

  const progress = getProgressPercent(campaign.raised, campaign.goal);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Hero image */}
      <div
        className="h-64 lg:h-80 w-full relative"
        style={{
          background:
            campaign.category === "Patrimonio"
              ? "linear-gradient(135deg,#92400E,#B45309)"
              : campaign.category === "Cultura"
              ? "linear-gradient(135deg,#4C1D95,#7C3AED)"
              : "linear-gradient(135deg,#065F46,#059669)",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
          <Link
            href="/proyectos"
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a proyectos
          </Link>
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            {campaign.category}
          </span>
          <h1 className="text-2xl lg:text-4xl font-bold text-white">
            {campaign.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1">
            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-3xl font-bold text-[#8B1A1A]">
                  {formatCLP(campaign.raised)}
                </span>
                <span className="text-sm text-gray-400">
                  Meta: {formatCLP(campaign.goal)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-2">
                <div
                  className="h-full bg-[#8B1A1A] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-[#8B1A1A]">{progress}% recaudado</p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Sobre este proyecto
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Donation card */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <ActiveCampaignCard campaign={campaign} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
