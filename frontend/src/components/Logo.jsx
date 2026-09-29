export default function Logo({ textColor = "text-white", size = "normal", stacked = false }) {
  const badgeSize = size === "large" ? "w-12 h-12" : "w-8 h-8";
  const svgSize = size === "large" ? 48 : 32;
  const textSize = size === "large" ? "text-2xl" : "text-lg";

  return (
    <div className={`flex items-center ${stacked ? "flex-col gap-2" : "gap-2"}`}>
      <svg width={svgSize} height={svgSize} viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#7C3AED" />
        <text
          x="50"
          y="54"
          fill="white"
          fontSize="60"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
        >S</text>
      </svg>
      <span className={`font-bold ${textSize} ${textColor}`}>Shopfront</span>
    </div>
  );
}