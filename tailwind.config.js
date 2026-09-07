/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBFAF6",
        paper2: "#F3F0E8",
        ink: {
          DEFAULT: "#1F2D27",
          light: "#2C3F37",
          soft: "#4A5A53",
        },
        brass: {
          DEFAULT: "#B8862F",
          light: "#D3A551",
          dark: "#8F6621",
        },
        oxblood: "#8C3B2E",
        stone: "#6B675C",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        spine: "3px 3px 0 rgba(31, 45, 39, 0.12)",
        lift: "0 12px 24px -12px rgba(31, 45, 39, 0.35)",
      },
    },
  },
  plugins: [],
};
