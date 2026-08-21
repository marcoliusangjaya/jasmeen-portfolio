import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import { client } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Jasmeen — Portfolio",
  description: "Personal portfolio showcasing projects and work.",
};

export const revalidate = 60;

type HeaderLogo = { url: string; width?: number; height?: number };

type SiteColors = {
  headerBackground?: string;
  headerText?: string;
  headerBorder?: string;
  heroBackground?: string;
  heroText?: string;
  backgroundColor?: string;
  gridOutline?: string;
  gridText?: string;
  filteredBlockColor?: string;
  filterOutline?: string;
  filterText?: string;
  filterHoverBackground?: string;
  filterHoverText?: string;
  filterSelectedBackground?: string;
  filterSelectedText?: string;
  footerBackground?: string;
  footerText?: string;
};

const DEFAULTS: Required<SiteColors> = {
  headerBackground: "#F0F1ED",
  headerText: "#1A1A18",
  headerBorder: "#1A1A18",
  heroBackground: "#2E1A47",
  heroText: "#F0F1ED",
  backgroundColor: "#F0F1ED",
  gridOutline: "#1A1A18",
  gridText: "#1A1A18",
  filteredBlockColor: "#2E1A47",
  filterOutline: "#1A1A18",
  filterText: "#1A1A18",
  filterHoverBackground: "#888888",
  filterHoverText: "#FFFFFF",
  filterSelectedBackground: "#1A1A18",
  filterSelectedText: "#F0F1ED",
  footerBackground: "#4A4945",
  footerText: "#FFFFFF",
};

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

function sanitizeHex(hex: string | undefined, fallback: string): string {
  return hex && HEX_RE.test(hex) ? hex : fallback;
}

// Tailwind needs "R G B" (no rgb(), no commas) for colors that use the
// `rgb(var(--x) / <alpha-value>)` pattern so opacity modifiers keep working.
function hexToChannels(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings: SiteColors & { headerLogo?: HeaderLogo | null } =
    (await client.fetch(siteSettingsQuery)) ?? {};
  const c: Required<SiteColors> = {
    headerBackground: sanitizeHex(settings.headerBackground, DEFAULTS.headerBackground),
    headerText: sanitizeHex(settings.headerText, DEFAULTS.headerText),
    headerBorder: sanitizeHex(settings.headerBorder, DEFAULTS.headerBorder),
    heroBackground: sanitizeHex(settings.heroBackground, DEFAULTS.heroBackground),
    heroText: sanitizeHex(settings.heroText, DEFAULTS.heroText),
    backgroundColor: sanitizeHex(settings.backgroundColor, DEFAULTS.backgroundColor),
    gridOutline: sanitizeHex(settings.gridOutline, DEFAULTS.gridOutline),
    gridText: sanitizeHex(settings.gridText, DEFAULTS.gridText),
    filteredBlockColor: sanitizeHex(settings.filteredBlockColor, DEFAULTS.filteredBlockColor),
    filterOutline: sanitizeHex(settings.filterOutline, DEFAULTS.filterOutline),
    filterText: sanitizeHex(settings.filterText, DEFAULTS.filterText),
    filterHoverBackground: sanitizeHex(settings.filterHoverBackground, DEFAULTS.filterHoverBackground),
    filterHoverText: sanitizeHex(settings.filterHoverText, DEFAULTS.filterHoverText),
    filterSelectedBackground: sanitizeHex(settings.filterSelectedBackground, DEFAULTS.filterSelectedBackground),
    filterSelectedText: sanitizeHex(settings.filterSelectedText, DEFAULTS.filterSelectedText),
    footerBackground: sanitizeHex(settings.footerBackground, DEFAULTS.footerBackground),
    footerText: sanitizeHex(settings.footerText, DEFAULTS.footerText),
  };

  // Inline style has higher specificity than the :root defaults in
  // globals.css, so this reliably overrides them regardless of load order.
  const themeStyle = {
    ["--color-bg" as string]: c.backgroundColor,
    ["--color-accent" as string]: c.heroBackground,
    ["--color-accent-text" as string]: hexToChannels(c.heroText),
    ["--color-header-bg" as string]: c.headerBackground,
    ["--color-header-text" as string]: c.headerText,
    ["--color-header-border" as string]: c.headerBorder,
    ["--color-grid-outline" as string]: c.gridOutline,
    ["--color-grid-text" as string]: hexToChannels(c.gridText),
    ["--color-filtered-block" as string]: c.filteredBlockColor,
    ["--color-filter-outline" as string]: c.filterOutline,
    ["--color-filter-text" as string]: c.filterText,
    ["--color-filter-hover-bg" as string]: c.filterHoverBackground,
    ["--color-filter-hover-text" as string]: c.filterHoverText,
    ["--color-filter-selected-bg" as string]: c.filterSelectedBackground,
    ["--color-filter-selected-text" as string]: c.filterSelectedText,
    ["--color-footer-bg" as string]: c.footerBackground,
    ["--color-footer-text" as string]: hexToChannels(c.footerText),
  } as React.CSSProperties;

  return (
    <html lang="en" style={themeStyle}>
      <body className="antialiased">
        <Nav logo={settings.headerLogo ?? null} />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
