import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        milk: "#F7F1DF",
        pro: {
          bg: "#0B0B0F",
          card: "#12121A",
          milk: "#F7F1DF",
          primary: "#4C3AFF",
          violet: "#7C3AED",
          accent: "#22D3EE",
          success: "#00C896",
          warning: "#FFB020"
        }
      },
      boxShadow: {
        "pro-purple": "0 0 0 1px rgba(76, 58, 255, 0.45), 0 16px 40px rgba(124, 58, 237, 0.26)",
        "pro-cyan": "0 0 0 1px rgba(34, 211, 238, 0.35), 0 10px 30px rgba(34, 211, 238, 0.2)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Segoe UI", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "Inter", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SF Mono", "Consolas", "monospace"]
      },
      backgroundImage: {
        "pro-radial":
          "radial-gradient(110% 90% at 0% 0%, #151126 0%, #0B0B0F 38%, #07080f 100%)"
      }
    }
  },
  plugins: []
};

export default config;
