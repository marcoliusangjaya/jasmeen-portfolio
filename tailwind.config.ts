import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        text: "var(--color-text)",
        footer: "var(--color-footer)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        "accent-text": "rgb(var(--color-accent-text) / <alpha-value>)",
        headerBg: "var(--color-header-bg)",
        headerText: "var(--color-header-text)",
        headerBorder: "var(--color-header-border)",
        gridOutline: "var(--color-grid-outline)",
        gridText: "rgb(var(--color-grid-text) / <alpha-value>)",
        filteredBlock: "var(--color-filtered-block)",
        filterOutline: "var(--color-filter-outline)",
        filterText: "var(--color-filter-text)",
        filterHoverBg: "var(--color-filter-hover-bg)",
        filterHoverText: "var(--color-filter-hover-text)",
        filterSelectedBg: "var(--color-filter-selected-bg)",
        filterSelectedText: "var(--color-filter-selected-text)",
        footerBg: "var(--color-footer-bg)",
        footerText: "rgb(var(--color-footer-text) / <alpha-value>)",
      },
      fontFamily: {
        cabinet: ['"Cabinet Grotesk"', "sans-serif"],
        satoshi: ['"Satoshi"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
