export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
      colors: {
        ink: "#111827",
        brand: "#7C3AED",
        accent: "#F59E0B",
        muted: "#6B7280",
      },
    },
  },
  plugins: [],
};
