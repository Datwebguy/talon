import Image from "next/image";

interface TalonLogoProps {
  className?: string;
  size?: number;
  rounded?: "full" | "xl" | "lg" | "md" | "none";
}

export function TalonLogo({
  className = "w-8 h-8",
  size = 32,
  rounded = "xl",
}: TalonLogoProps) {
  const roundedClass = {
    full: "rounded-full",
    xl: "rounded-xl",
    lg: "rounded-lg",
    md: "rounded-md",
    none: "",
  }[rounded];

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden flex-shrink-0 ${roundedClass} ${className} shadow-[0_4px_16px_rgba(1,15,238,0.25)]`}
    >
      <Image
        src="/talon-logo.png"
        alt="Talon Logo"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
}
