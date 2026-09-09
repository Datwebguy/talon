import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        base: {
          blue: "#010FEE",
          blueHover: "#000ED6",
          blueLight: "#2634FF",
          blueSubtle: "rgba(1, 15, 238, 0.12)",
          navy: "#060A20",
          surface: "#111318",
          elevated: "#181A22",
          border: "#20242E",
          borderHover: "#2F3543",
          muted: "#8A919E",
          subtle: "#5B616E",
        },
        brand: {
          blue: "#010FEE",
          blueHover: "#000ED6",
          blueLight: "#2634FF",
          blueSoft: "#EEF2FF",
          blueDark: "#000B99",
          ink: "#050B24",
          surface: "#F8FAFC",
          mist: "#EEF2FF",
        },
        talon: {
          blue: "#010FEE",
          cyan: "#00D2FF",
          purple: "#7928CA",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
