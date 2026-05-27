import { transparency } from "@/lib/landing-config";

export default function LandingTransparency() {
  return (
    <div className="bg-[#F9FAFB] rounded-2xl border border-gray-100 p-8 h-full shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-1">{transparency.title}</h3>
      <p className="text-sm text-gray-500 mb-7 leading-relaxed">
        {transparency.subtitle}
      </p>

      <div className="grid grid-cols-2 gap-5">
        {transparency.items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-2xl font-bold text-gray-900">{item.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-[#8B1A1A] rounded-full"
                style={{ width: `${item.pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 leading-tight">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
