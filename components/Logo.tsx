"use client";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { circle: 32, text: "text-xs" },
  md: { circle: 44, text: "text-sm" },
  lg: { circle: 56, text: "text-base" },
};

export default function Logo({
  variant = "dark",
  size = "md",
  className = "",
}: LogoProps) {
  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-[#111827]";
  const subColor = variant === "light" ? "text-white/80" : "text-[#6B7280]";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circle seal mark */}
      <svg
        width={s.circle}
        height={s.circle}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle
          cx="22"
          cy="22"
          r="20"
          stroke={variant === "light" ? "white" : "#8B1A1A"}
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r="16"
          stroke={variant === "light" ? "white" : "#8B1A1A"}
          strokeWidth="0.75"
          strokeDasharray="2 2"
          fill="none"
        />
        {/* Horizon line */}
        <line
          x1="10"
          y1="27"
          x2="34"
          y2="27"
          stroke={variant === "light" ? "white" : "#8B1A1A"}
          strokeWidth="1.5"
        />
        {/* Sail / mountain triangle */}
        <path
          d="M22 12 L31 27 L13 27 Z"
          fill={variant === "light" ? "white" : "#8B1A1A"}
          fillOpacity="0.2"
          stroke={variant === "light" ? "white" : "#8B1A1A"}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Water reflection lines */}
        <line
          x1="12"
          y1="31"
          x2="32"
          y2="31"
          stroke={variant === "light" ? "white" : "#8B1A1A"}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="15"
          y1="34"
          x2="29"
          y2="34"
          stroke={variant === "light" ? "white" : "#8B1A1A"}
          strokeWidth="0.75"
          strokeOpacity="0.3"
        />
      </svg>

      {/* Text block */}
      <div className="leading-tight">
        <div
          className={`font-bold tracking-wide ${s.text} ${textColor}`}
          style={{ letterSpacing: "0.12em" }}
        >
          PLOC
        </div>
        <div
          className={`font-medium uppercase ${subColor}`}
          style={{ fontSize: "0.55rem", letterSpacing: "0.06em", lineHeight: 1.3 }}
        >
          Corporación Plan
          <br />
          Puerto Octay
        </div>
      </div>
    </div>
  );
}
