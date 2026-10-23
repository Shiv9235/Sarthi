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
        // Soft healthcare green
        primary: {
          50: "#f2f9f4",
          100: "#e2f2e7",
          200: "#c6e5d1",
          300: "#9ccfb1",
          400: "#6cb38c",
          500: "#43966a",
          600: "#2f7a53",
          700: "#266243",
          800: "#214f38",
          900: "#1c412f",
          950: "#0d2419",
        },
        // Muted warm sage green
        sage: {
          50: "#f7f9f7",
          100: "#e9ede9",
          200: "#d5ddd5",
          300: "#b5c3b5",
          400: "#91a491",
          500: "#758875",
          600: "#5c6d5c",
          700: "#4a574a",
          800: "#3d473d",
          900: "#343c34",
          950: "#1a201a",
        },
        surface: {
          ground: "#f7f9f6",
          card: "#ffffff",
          muted: "#edf3ee",
          border: "#dde6df",
        },
      },
    },
  },
  plugins: [],
};

export default config;
