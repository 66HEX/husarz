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
        background: "#000000",
        foreground: "#ffffff",
        "text-primary": "#ffffff",
        "text-secondary": "rgba(255,255,255,0.8)",
        "text-black": "#000000",
        card: "rgba(255,255,255,0.05)",
        navbar: "rgba(0,0,0,0.6)",
        "social-icon": "rgba(0,0,0,0.5)",
        border: "rgba(255,255,255,0.1)"
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