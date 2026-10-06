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
        brand: {
          primary: "#c0175b", // Elegant magenta/rose inspired by logo lotus
          primaryDark: "#910e42",
          primaryLight: "#e3427d",
          secondary: "#15803d", // Lush green nature / land / prosperity
          secondaryDark: "#166534",
          secondaryLight: "#22c55e",
          navy: "#0f172a",
          gold: "#d97706",
          dark: "#0b0f19",
          card: "#1e293b",
          lightBg: "#f8fafc",
          muted: "#64748b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
