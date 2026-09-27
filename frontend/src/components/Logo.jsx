export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 100 100">
        {/* rounded square background, using your brand color */}
        <rect width="100" height="100" rx="24" fill="#7C3AED" />
        {/* letter "S" centered inside it, white */}
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
      <span className="font-bold text-lg text-white">Shopfront</span>
    </div>
  );
}