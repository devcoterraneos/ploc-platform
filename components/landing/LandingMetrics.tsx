import { impactStats } from "@/lib/landing-config";

export default function LandingMetrics() {
  return (
    <section id="impacto" className="bg-white border-y border-gray-100 py-10 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
              <span className="text-xs text-gray-400">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
