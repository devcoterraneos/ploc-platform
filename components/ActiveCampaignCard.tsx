"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { formatCLP, getProgressPercent } from "@/lib/data";

interface ActiveCampaignCardProps {
  campaign: Campaign;
}

export default function ActiveCampaignCard({
  campaign,
}: ActiveCampaignCardProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    campaign.donationAmounts[1] ?? null
  );
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const progress = getProgressPercent(campaign.raised, campaign.goal);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setShowCustom(false);
    setCustomAmount("");
  };

  const handleOtros = () => {
    setSelectedAmount(null);
    setShowCustom(true);
  };

  const finalAmount =
    showCustom && customAmount
      ? parseInt(customAmount.replace(/\D/g, ""), 10)
      : selectedAmount;

  const donateUrl = finalAmount
    ? `/donar?campaignId=${campaign.id}&amount=${finalAmount}`
    : `/donar?campaignId=${campaign.id}`;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm">
      {/* Campaign label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-[#8B1A1A] animate-pulse" />
        <span className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase">
          Campaña Activa
        </span>
      </div>

      {/* Campaign name */}
      <h3 className="text-lg font-bold text-gray-900 mb-0.5">
        {campaign.name}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{campaign.shortDescription}</p>

      {/* Amounts */}
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-3xl font-bold text-[#8B1A1A]">
          {formatCLP(campaign.raised)}
        </span>
        <span className="text-sm text-gray-400">
          {formatCLP(campaign.goal)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative mb-2">
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-[#8B1A1A] rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="text-xs font-semibold text-[#8B1A1A] mb-3">{progress}%</p>

      <p className="text-xs text-gray-500 mb-4">
        Cada aporte impulsa proyectos reales en nuestra comuna.
      </p>

      {/* Donation amount buttons */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {campaign.donationAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleAmountSelect(amount)}
            className={`py-2 text-xs font-bold rounded-lg border transition-all ${
              selectedAmount === amount && !showCustom
                ? "bg-[#8B1A1A] text-white border-[#8B1A1A]"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
            }`}
          >
            {formatCLP(amount).replace("$ ", "$")}
          </button>
        ))}
        <button
          onClick={handleOtros}
          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
            showCustom
              ? "bg-[#8B1A1A] text-white border-[#8B1A1A]"
              : "bg-white text-gray-700 border-gray-200 hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
          }`}
        >
          Otros
        </button>
      </div>

      {/* Custom amount input */}
      {showCustom && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Ingresa monto (ej: 15000)"
            value={customAmount}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setCustomAmount(raw);
            }}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]"
          />
        </div>
      )}

      {/* CTA Button */}
      <Link
        href={donateUrl}
        className="flex items-center justify-center gap-2 w-full bg-[#8B1A1A] hover:bg-[#7A1616] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
      >
        <Heart className="w-4 h-4 fill-white" />
        {campaign.ctaText}
      </Link>
    </div>
  );
}
