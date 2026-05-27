import Image from "next/image";
import { defaultSiteSettings } from "@/lib/data";

export default function LandingTestimonial() {
  const t = defaultSiteSettings.testimonial;
  const initials = t.name
    .split(" ")
    .filter((_, i) => i === 0 || i === 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#F9FAFB] rounded-3xl border border-gray-100 px-8 py-10 lg:px-14 lg:py-12 overflow-hidden">

          {/* Decorative large quote mark */}
          <span
            className="absolute top-4 left-6 text-[9rem] font-serif leading-none select-none pointer-events-none"
            style={{ color: "#8B1A1A", opacity: 0.08 }}
          >
            &ldquo;
          </span>

          <div className="relative flex flex-col lg:flex-row items-center gap-10">
            {/* Left — quote + person */}
            <div className="flex-1">
              {/* Quote mark visible */}
              <span
                className="block text-4xl font-serif leading-none mb-4"
                style={{ color: "#8B1A1A" }}
              >
                &ldquo;
              </span>

              <p className="text-xl lg:text-2xl text-gray-800 font-medium leading-relaxed mb-7 italic">
                {t.quote}
              </p>

              {/* Person */}
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  style={{ backgroundColor: "#8B1A1A" }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>

            {/* Right — Sello */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3 opacity-90">
              <Image
                src="/images/sello-puerto-octay.png"
                alt="Sello Puerto Octay"
                width={140}
                height={140}
                className="drop-shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
