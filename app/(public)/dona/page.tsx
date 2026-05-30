"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Heart, ArrowLeft, Share2, ChevronLeft, ChevronRight,
  Wrench, Shield, CheckCircle,
} from "lucide-react";
import { formatCLP } from "@/lib/data";
import supabase from "@/lib/supabase";
import DonationModal, { type ProjectForModal } from "@/components/landing/DonationModal";
import { useSettings } from "@/lib/settings-context";

type Campaign = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  objective: string | null;
  resources_use: string | null;
  category: string | null;
  category_color: string | null;
  category_bg: string | null;
  goal: number;
  raised: number;
  image_url: string | null;
  image_gradient: string | null;
  donation_amounts: number[] | null;
  images: { url: string; isPrimary: boolean }[] | null;
};

function toModal(c: Campaign): ProjectForModal {
  return {
    id:              c.id,
    name:            c.name,
    description:     c.short_description ?? "",
    objective:       c.objective ?? "",
    resourcesUse:    c.resources_use ?? "",
    goal:            c.goal,
    raised:          c.raised,
    imageUrl:        c.image_url ?? undefined,
    imageGradient:   c.image_gradient ?? "linear-gradient(135deg,#8B1A1A,#B45309)",
    donationAmounts: c.donation_amounts ?? [5000, 10000, 25000, 50000],
    category:        c.category ?? "",
    categoryColor:   c.category_color ?? "#8B1A1A",
    categoryBg:      c.category_bg ?? "#FEF3C7",
  };
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="h-80 bg-gray-200" />
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-4">
          <div className="h-7 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-4/6" />
        </div>
        <div className="h-72 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}

export default function DonaPage() {
  const { primaryColor } = useSettings();
  const pathname    = usePathname();
  const slug        = pathname?.split("/")[2] ?? "";
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied]     = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);

  useEffect(() => {
    if (!slug) { setLoading(false); setNotFound(true); return; }
    supabase
      .from("campaigns")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setCampaign(data as Campaign);
        setLoading(false);
      });
  }, [slug]);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: campaign?.name ?? "Campaña PLOC", url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (loading) return <Skeleton />;

  if (notFound || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Heart className="w-8 h-8" style={{ color: primaryColor }} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Campaña no encontrada</h1>
        <p className="text-sm text-gray-500 mb-6">Esta campaña no existe o ya no está disponible.</p>
        <Link
          href="/#proyectos"
          className="px-6 py-3 text-white rounded-xl font-semibold text-sm transition-colors"
          style={{ backgroundColor: primaryColor }}
        >
          Ver todas las campañas
        </Link>
      </div>
    );
  }

  const pct       = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
  const remaining = Math.max(campaign.goal - campaign.raised, 0);

  // Build carousel images list: prefer images[] array, fallback to single image_url
  const carouselImages: string[] =
    campaign.images?.length
      ? campaign.images
          .slice()
          .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
          .map(i => i.url)
      : campaign.image_url
      ? [campaign.image_url]
      : [];

  const prevSlide = () => setCarouselIdx(i => (i - 1 + carouselImages.length) % carouselImages.length);
  const nextSlide = () => setCarouselIdx(i => (i + 1) % carouselImages.length);

  return (
    <>
      <div className="min-h-screen bg-white pb-24 lg:pb-0">

        {/* ── Hero / Carousel ── */}
        <div className="relative h-72 lg:h-[420px] w-full overflow-hidden">

          {/* Images with crossfade */}
          {carouselImages.length > 0 ? (
            carouselImages.map((url, i) => (
              <img
                key={url}
                src={url}
                alt={campaign.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  i === carouselIdx ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: campaign.image_gradient ?? "linear-gradient(135deg,#8B1A1A,#B45309)" }}
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

          {/* Back */}
          <div className="absolute top-5 left-5">
            <Link
              href="/#proyectos"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-medium bg-black/30 hover:bg-black/50 backdrop-blur-sm px-3.5 py-2 rounded-full transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
          </div>

          {/* Prev / Next arrows — only when more than 1 image */}
          {carouselImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Hero text + dots */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 lg:px-10 lg:pb-10">
            {/* Dots — above the title */}
            {carouselImages.length > 1 && (
              <div className="flex gap-1.5 mb-3">
                {carouselImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === carouselIdx ? "w-5 bg-white" : "w-1.5 bg-white/50"
                    }`}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>
            )}
            {campaign.category && (
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                style={{
                  backgroundColor: campaign.category_bg ?? "#FEF3C7",
                  color:           campaign.category_color ?? "#8B1A1A",
                }}
              >
                {campaign.category}
              </span>
            )}
            <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight max-w-2xl drop-shadow-sm">
              {campaign.name}
            </h1>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-14 items-start">

            {/* ── LEFT: narrative ── */}
            <div>
              {campaign.short_description && (
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                  {campaign.short_description}
                </p>
              )}

              {campaign.resources_use && (
                <div className="mb-7">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
                      Uso de los recursos
                    </h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed pl-[52px]">
                    {campaign.resources_use}
                  </p>
                </div>
              )}

              <hr className="border-gray-100 mt-6 mb-5" />

              {/* Trust signals */}
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Pago vía Tarjeta o Transferencia, tú eliges
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Respaldado por Corporación PLOC
                </span>
              </div>
            </div>

            {/* ── RIGHT: donation card (sticky) ── */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/60 p-6">

                {/* Numbers */}
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 leading-none">
                      {formatCLP(campaign.raised)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      recaudado de {formatCLP(campaign.goal)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl lg:text-3xl font-bold leading-none" style={{ color: primaryColor }}>
                      {pct}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">completado</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: primaryColor }}
                  />
                </div>

                {remaining > 0 && (
                  <p className="text-xs text-gray-400 text-center mb-5">
                    Faltan{" "}
                    <span className="font-semibold text-gray-600">{formatCLP(remaining)}</span>{" "}
                    para llegar a la meta
                  </p>
                )}

                {pct >= 100 && (
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold text-green-600 bg-green-50 rounded-xl py-2.5 mb-4">
                    <CheckCircle className="w-4 h-4" />
                    ¡Meta alcanzada!
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full flex items-center justify-center gap-2 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-lg text-base mb-3"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Donar ahora
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      ¡Enlace copiado!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Compartir campaña
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                  🔒 Tu donación va directo al proyecto
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 z-40">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: primaryColor }}
              />
            </div>
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-gray-600">{pct}%</span> completado
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-white font-bold px-5 py-3 rounded-xl transition-colors shadow-md text-sm flex-shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <Heart className="w-4 h-4 fill-white" />
            Donar
          </button>
        </div>
      </div>

      {/* Donation modal — starts at step 2 (skip campaign info) */}
      <DonationModal
        project={showModal ? toModal(campaign) : null}
        onClose={() => setShowModal(false)}
        initialStep={2}
      />
    </>
  );
}
