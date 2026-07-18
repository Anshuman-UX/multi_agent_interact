/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        surface: "#12122a",
        "surface-alt": "#1a1a3e",
        "bg-start": "#06060f",
        "bg-end": "#0e0e20",
        llama: "#8b5cf6",
        llama8b: "#10b981",
        gemini: "#3b82f6",
        gold: "#f59e0b",
      },
    },
  },
  plugins: [],
}
