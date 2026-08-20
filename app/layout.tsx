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

type SiteSettings = {
  headerBackground?: string;
  headerText?: string;
  heroBackground?: string;
  backgroundColor?: string;
  gridOutline?: string;
  gridText?: string;
  filteredBlockColor?: string;
  filterOutline?: string;
  filterText?: string;
  footerBackground?: string;
  footerText?: string;
};

const DEFAULTS: Required<SiteSettings> = {
  headerBackground: "#F0F1ED",
  headerText: "#1A1A18",
  heroBackground: "#2E1A47",
  backgroundColor: "#F0F1ED",
  gridOutline: "#1A1A18",
  gridText: "#1A1A18",
  filteredBlockColor: "#2E1A47",
  filterOutline: "#1A1A18",
  filterText: "#1A1A18",
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
  const settings: SiteSettings = (await client.fetch(siteSettingsQuery)) ?? {};
  const c: Required<SiteSettings> = {
    headerBackground: sanitizeHex(settings.headerBackground, DEFAULTS.headerBackground),
    headerText: sanitizeHex(settings.headerText, DEFAULTS.headerText),
    heroBackground: sanitizeHex(settings.heroBackground, DEFAULTS.heroBackground),
    backgroundColor: sanitizeHex(settings.backgroundColor, DEFAULTS.backgroundColor),
    gridOutline: sanitizeHex(settings.gridOutline, DEFAULTS.gridOutline),
    gridText: sanitizeHex(settings.gridText, DEFAULTS.gridText),
    filteredBlockColor: sanitizeHex(settings.filteredBlockColor, DEFAULTS.filteredBlockColor),
    filterOutline: sanitizeHex(settings.filterOutline, DEFAULTS.filterOutline),
    filterText: sanitizeHex(settings.filterText, DEFAULTS.filterText),
    footerBackground: sanitizeHex(settings.footerBackground, DEFAULTS.footerBackground),
    footerText: sanitizeHex(settings.footerText, DEFAULTS.footerText),
  };

  // Inline style has higher specificity than the :root defaults in
  // globals.css, so this reliably overrides them regardless of load order.
  const themeStyle = {
    ["--color-bg" as string]: c.backgroundColor,
    ["--color-accent" as string]: c.heroBackground,
    ["--color-header-bg" as string]: c.headerBackground,
    ["--color-header-text" as string]: c.headerText,
    ["--color-grid-outline" as string]: c.gridOutline,
    ["--color-grid-text" as string]: hexToChannels(c.gridText),
    ["--color-filtered-block" as string]: c.filteredBlockColor,
    ["--color-filter-outline" as string]: c.filterOutline,
    ["--color-filter-text" as string]: c.filterText,
    ["--color-footer-bg" as string]: c.footerBackground,
    ["--color-footer-text" as string]: hexToChannels(c.footerText),
  } as React.CSSProperties;

  return (
    <html lang="en" style={themeStyle}>
      <body className="antialiased">
        <Nav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
