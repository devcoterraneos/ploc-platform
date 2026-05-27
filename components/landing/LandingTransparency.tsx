"use client";

import { useSettings } from "@/lib/settings-context";

const icons: Record<string, string> = {
  sprout: "🌱", users: "🤝", settings: "⚙️", megaphone: "📣",
};

export default function LandingTransparency() {
  const s = useSettings();

  return (
    <div className="bg-[#F9FAFB] rounded-2xl border border-gray-100 p-8 h-full shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-1">{s.transparencyTitle}</h3>
      <p className="text-sm text-gray-500 mb-7 leading-relaxed">{s.transparencySubtitle}</p>

      <div className="grid grid-cols-2 gap-5">
        {s.transparencyItems.map((item) => (
          <div key={item.id} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{icons[item.icon] ?? "•"}</span>
              <span className="text-2xl font-bold text-gray-900">{item.percentage}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${item.percentage}%`, backgroundColor: s.primaryColor }}
              />
            </div>
            <p className="text-xs text-gray-500 leading-tight">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
