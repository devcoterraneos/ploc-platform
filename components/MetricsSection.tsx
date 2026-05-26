import { HeartHandshake, Users, Building2, RefreshCw } from "lucide-react";
import type { Metric } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  "heart-handshake": <HeartHandshake className="w-7 h-7 text-[#8B1A1A]" />,
  users: <Users className="w-7 h-7 text-[#8B1A1A]" />,
  "building-2": <Building2 className="w-7 h-7 text-[#8B1A1A]" />,
  "refresh-cw": <RefreshCw className="w-7 h-7 text-[#8B1A1A]" />,
};

interface MetricsSectionProps {
  metrics: Metric[];
}

export default function MetricsSection({ metrics }: MetricsSectionProps) {
  return (
    <section className="relative z-10 -mt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 lg:p-6 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                {iconMap[metric.icon] ?? (
                  <HeartHandshake className="w-7 h-7 text-[#8B1A1A]" />
                )}
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-sm font-semibold text-gray-700 leading-tight">
                  {metric.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
