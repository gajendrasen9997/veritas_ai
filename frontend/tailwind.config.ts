import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Primary (Deep Navy)
        primary: "#031635",
        "primary-container": "#1a2b4b",
        "on-primary": "#ffffff",
        "on-primary-container": "#8293b8",
        "primary-fixed": "#d8e2ff",
        "primary-fixed-dim": "#b6c6ef",
        "on-primary-fixed": "#081b3a",
        "on-primary-fixed-variant": "#364768",

        // Background & Surfaces (Paper minimal editorial style)
        background: "#f7f9fb",
        surface: "#f7f9fb",
        "surface-bright": "#f7f9fb",
        "surface-dim": "#d8dadc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-variant": "#e0e3e5",
        "surface-tint": "#4e5e81",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f3",
        "inverse-primary": "#b6c6ef",

        // Text & Outlines
        "on-surface": "#191c1e",
        "on-surface-variant": "#44474e",
        "on-background": "#191c1e",
        outline: "#75777f",
        "outline-variant": "#c5c6cf",

        // Diagnostic Signals - Low (Yellow)
        secondary: "#6e5e0d",
        "secondary-container": "#f6df84",
        "secondary-fixed": "#f9e287",
        "secondary-fixed-dim": "#dcc66e",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#726212",
        "on-secondary-fixed": "#221b00",
        "on-secondary-fixed-variant": "#534600",

        // Diagnostic Signals - Medium (Orange/Amber)
        tertiary: "#291000",
        "tertiary-container": "#482100",
        "tertiary-fixed": "#ffdcc5",
        "tertiary-fixed-dim": "#ffb783",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#dc7924",
        "on-tertiary-fixed": "#301400",
        "on-tertiary-fixed-variant": "#713700",

        // Diagnostic Signals - High (Red/Error)
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        "display-lg": ["Noto Serif", "Georgia", "serif"],
        "reading-body": ["Noto Serif", "Georgia", "serif"],
        "headline-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-lg-mobile": ["Hanken Grotesk", "sans-serif"],
        "ui-body": ["Hanken Grotesk", "sans-serif"],
        "label-caps": ["Hanken Grotesk", "sans-serif"],
        "data-mono": ["JetBrains Mono", "monospace"],
        sans: ["Hanken Grotesk", "sans-serif"],
        serif: ["Noto Serif", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      spacing: {
        unit: "4px",
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "48px",
        "reading-column": "720px",
        "container-max": "1280px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(3, 22, 53, 0.05)",
        floating: "0 2px 4px rgba(26, 43, 75, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
