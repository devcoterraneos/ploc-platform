"use client";

import { useState } from "react";
import { Share2, Check, Copy, Mail } from "lucide-react";

const SHARE_URL = "https://ploc.pages.dev";
const SHARE_TITLE = "Apoya a Puerto Octay";
const SHARE_TEXT =
  "Acabo de apoyar un proyecto de Corporación PLOC. ¡Únete tú también y ayuda a transformar Puerto Octay!";

const channels = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    href: () =>
      `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    href: () =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X / Twitter",
    color: "#000000",
    href: () =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Correo",
    color: "#6B7280",
    href: () =>
      `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${SHARE_URL}`)}`,
    icon: <Mail className="w-5 h-5 text-white" />,
  },
];

export default function GraciasShare() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    // Intenta Web Share API nativa (móvil)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
        return;
      } catch {
        // usuario canceló o no disponible → abre el panel manual
      }
    }
    setOpen((v) => !v);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Botón principal */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-3 bg-[#8B1A1A] hover:bg-[#7A1616] active:scale-[0.97] text-white font-bold px-8 py-4 rounded-full transition-all text-base shadow-lg shadow-red-900/25"
      >
        <Share2 className="w-5 h-5" />
        Compartir y correr la voz
      </button>

      {/* Panel de canales (solo si Web Share no está disponible) */}
      {open && (
        <div className="w-full max-w-xs bg-white rounded-2xl border border-gray-100 shadow-xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 text-center">
            Elige cómo compartir
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {channels.map((ch) => (
              <a
                key={ch.id}
                href={ch.href()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75"
                style={{ backgroundColor: ch.color }}
              >
                {ch.icon}
                {ch.label}
              </a>
            ))}
          </div>

          {/* Copiar enlace */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-700 hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">¡Enlace copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar enlace
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
