import { Sprout, Users, Settings, Megaphone } from "lucide-react";
import type { TransparencyItem } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  sprout: <Sprout className="w-6 h-6 text-gray-700" />,
  users: <Users className="w-6 h-6 text-gray-700" />,
  settings: <Settings className="w-6 h-6 text-gray-700" />,
  megaphone: <Megaphone className="w-6 h-6 text-gray-700" />,
};

interface TransparencySectionProps {
  title?: string;
  subtitle?: string;
  items: TransparencyItem[];
}

export default function TransparencySection({
  title = "Tu aporte se usa con responsabilidad",
  subtitle = "Así distribuimos los recursos para maximizar el impacto en Puerto Octay.",
  items,
}: TransparencySectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full flex flex-col">
      {/* Label */}
      <p className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase mb-4">
        Transparencia
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">{subtitle}</p>

      {/* Distribution items */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              {iconMap[item.icon] ?? <Sprout className="w-5 h-5 text-gray-600" />}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{item.percentage}%</p>
              <p className="text-xs text-gray-500 leading-tight">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
