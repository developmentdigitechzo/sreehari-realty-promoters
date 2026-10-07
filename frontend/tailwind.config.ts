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
        theme: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#108474", // Primary requested theme #108474
          700: "#0d6b5e",
          800: "#0a5248",
          900: "#063730",
          DEFAULT: "#108474",
          dark: "#0c6a5d",
          light: "#149b88",
        },
        accessory: {
          DEFAULT: "#E52E3D", // Like & Action Accessories #e52e3d
          hover: "#cc1f2e",
          light: "#ff4d5a",
          dark: "#b31b28",
          bg: "#fef2f2",
        },
        terracotta: {
          DEFAULT: "#108474",
          dark: "#0c6a5d",
          light: "#149b88",
        },
        brand: {
          primary: "#108474", // Primary #108474
          primaryDark: "#0c6a5d",
          primaryLight: "#149b88",
          accent: "#E52E3D", // Like button & accessory color #e52e3d
          like: "#E52E3D",
          accessory: "#E52E3D",
          secondary: "#108474",
          secondaryDark: "#0c6a5d",
          secondaryLight: "#149b88",
          navy: "#0a2622",
          dark: "#071c19",
          gold: "#D97706",
          card: "#0d312c",
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
