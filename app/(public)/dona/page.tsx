"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Heart, ArrowLeft, ChevronLeft, ChevronRight,
  Wrench, CheckCircle, Share2,
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
  instagram_url: string | null;
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
  const [showModal, setShowModal]         = useState(false);
  const [modalMethod, setModalMethod]     = useState<"card" | "transfer" | undefined>(undefined);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [copied, setCopied]           = useState(false);

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
    if (!campaign) return;
    const url  = window.location.href;
    const text = `¡Te invito a apoyar a ${campaign.name}! 🙌 Cada aporte cuenta para hacer realidad este proyecto en Puerto Octay. Dona aquí 👉 ${url}`;
    if (navigator.share) {
      await navigator.share({ title: campaign.name, text, url });
    } else {
      await navigator.clipboard.writeText(text);
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
        {/*
          Mobile order:  1-description  2-trust  3-card  4-resources
          Desktop order: col1=description+resources+trust  col2=card
        */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_340px] lg:grid-rows-[auto_auto_auto] lg:gap-x-14 lg:gap-y-8 lg:items-start">

            {/* ── 1. Description ── mobile:order-1 / desktop:col1 row1 ── */}
            {campaign.short_description && (
              <p className="order-1 lg:col-start-1 lg:row-start-1 text-lg lg:text-xl text-gray-700 leading-relaxed font-medium">
                {campaign.short_description}
              </p>
            )}


            {/* ── 3. Donation card ── mobile:order-3 / desktop:col2 rows1-3 ── */}
            <div className="order-3 lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-6">
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

                {/* CTAs */}
                <div className="flex flex-col gap-2.5 mb-3">
                  {/* Tarjeta */}
                  <button
                    onClick={() => { setModalMethod("card"); setShowModal(true); }}
                    className="w-full flex flex-col items-center justify-center active:scale-[0.98] text-white rounded-xl transition-all shadow-lg py-3"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="font-bold text-base flex items-center gap-2">
                      <Heart className="w-4 h-4 fill-white" />
                      Donar con tarjeta
                    </span>
                    <span className="text-xs opacity-80 mt-0.5">débito, crédito</span>
                  </button>

                  {/* Transferencia */}
                  <button
                    onClick={() => { setModalMethod("transfer"); setShowModal(true); }}
                    className="w-full flex flex-col items-center justify-center rounded-xl border-2 transition-all py-3"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    <span className="font-bold text-base">Donar via transferencia</span>
                    <span className="text-xs opacity-70 mt-0.5">click para ver los datos</span>
                  </button>
                </div>

                <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                  ✓ Donación Certificada por Corporación PLOC
                </p>
              </div>
            </div>

            {/* ── 4. Resources + Org section ── mobile:order-4 / desktop:col1 row2 ── */}
            <div className="order-4 lg:col-start-1 lg:row-start-2 space-y-7">

              {campaign.resources_use && (
                <div>
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

              {/* ── Conoce a la organización ── */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: primaryColor }}>
                  Conoce a la organización
                </h2>
                <div className="flex flex-wrap gap-3">
                  {campaign.instagram_url && (
                    <a
                      href={campaign.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                      style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)" }}
                    >
                      <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      Conoce a la organización
                    </a>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Compartir campaña
                      </>
                    )}
                  </button>
                </div>
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
        onClose={() => { setShowModal(false); setModalMethod(undefined); }}
        initialStep={2}
        initialMethod={modalMethod}
      />
    </>
  );
}
