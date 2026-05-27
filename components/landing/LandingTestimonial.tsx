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
        <div
          className="relative rounded-3xl px-8 py-10 lg:px-14 lg:py-14 overflow-hidden"
          style={{ backgroundColor: "#8B1A1A" }}
        >
          {/* Decorative large quote mark */}
          <span
            className="absolute top-4 left-6 text-[9rem] font-serif leading-none select-none pointer-events-none text-white/10"
          >
            &ldquo;
          </span>

          <div className="relative max-w-2xl">
            {/* Visible quote mark */}
            <span className="block text-4xl font-serif leading-none mb-4 text-white/50">
              &ldquo;
            </span>

            <p className="text-xl lg:text-2xl text-white font-medium leading-relaxed mb-8 italic">
              {t.quote}
            </p>

            {/* Person */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold bg-white/20 text-white border border-white/30">
                {initials}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-white/60">{t.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
