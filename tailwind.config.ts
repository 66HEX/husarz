import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0E0E0E",
        foreground: "#ffffff",
        "text-primary": "#ffffff",
        "text-secondary": "rgba(255,255,255,0.75)",
        "text-black": "#000000",
        card: "#141414",
        innercard: "#1A1A1A",
        active: "#202020",
        active2: "#252525",
        navbar: "#141414",
        "social-icon": "rgba(0,0,0,0.5)",
        border: "rgba(255,255,255,0.075)",
        borderactive: "rgba(255,255,255,0.075)"

      },
      fontFamily: {
        sans: ['var(--font-hoves)'],
      },
      borderRadius: {
        card: "0.75rem",
        icon: "0.5rem"
      }
    },
  },
  plugins: [],
} satisfies Config;