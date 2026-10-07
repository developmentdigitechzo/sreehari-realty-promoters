import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warmBg: "#FAF8F5",
        warmCream: "#F5EFEB",
        warmBorder: "#E8E0D7",
        terracotta: {
          DEFAULT: "#EB5E28",
          dark: "#C84B19",
          light: "#F78354",
        },
        brand: {
          primary: "#E52E3D", // High energy crimson / terracotta red
          primaryDark: "#BD1E2B",
          primaryLight: "#F87171",
          secondary: "#059669", // DTCP & Clear Titles Emerald Green
          secondaryDark: "#047857",
          secondaryLight: "#10B981",
          navy: "#0F172A",
          dark: "#1C1917",
          gold: "#D97706",
          card: "#1E293B",
          lightBg: "#FAF8F5",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-outfit)", "Georgia", "serif", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
