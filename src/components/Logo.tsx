"use client";

import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ size = "md", showText = false }: LogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };

  const imageSizes = {
    sm: 40,
    md: 56,
    lg: 80,
    xl: 112,
  };

  // Larger size for HAM line, smaller for 대한혈관외과학회
  const hamTextSize =
    size === "xl" ? "text-xl" : size === "lg" ? "text-lg" : size === "md" ? "text-base" : "text-sm";
  const societyTextSize =
    size === "xl" ? "text-base" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <Image
          src="/monicalogo.png"
          alt="HAM 로고"
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <div>
          {/* Make society line smaller and blue, but on TOP */}
          <p className={`text-[#2e5aa7] font-medium ${societyTextSize}`}>
            대한혈관외과학회
          </p>
          {/* Make HAM line larger and navy, but on BOTTOM */}
          <p className={`text-[#1a2e5a] font-bold ${hamTextSize}`}>
            혈액투석길 연구회 (HAM)
          </p>
        </div>
      )}
    </div>
  );
}
