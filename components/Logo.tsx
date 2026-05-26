import Image from "next/image";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { width: 90, height: 41 },
  md: { width: 120, height: 54 },
  lg: { width: 150, height: 68 },
};

export default function Logo({
  variant = "dark",
  size = "md",
  className = "",
}: LogoProps) {
  const s = sizes[size];

  return (
    <div className={className}>
      <Image
        src="/images/logo-ploc.png"
        alt="Corporación PLOC — Plan Puerto Octay"
        width={s.width}
        height={s.height}
        style={variant === "light" ? { filter: "brightness(0) invert(1)" } : undefined}
        priority
      />
    </div>
  );
}
