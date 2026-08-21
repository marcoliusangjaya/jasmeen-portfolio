"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

type HeaderLogo = { url: string; width?: number; height?: number };

export default function Nav({ logo }: { logo: HeaderLogo | null }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only the homepage hero needs a transparent overlay (so it can bleed to
  // the very top) with hero-contrast text. Every other page — and the
  // homepage once scrolled past the hero — uses the opaque header
  // background/text pair, since there's no image behind the nav to reveal.
  const overHero = isHome && !scrolled;

  return (
    <header
      className={`${isHome ? "fixed inset-x-0" : "sticky"} top-0 z-50 border-b-[1.5px] transition-colors duration-300 ${
        overHero
          ? "bg-transparent border-transparent text-accent-text"
          : "bg-headerBg border-headerBorder text-headerText"
      }`}
    >
      <nav className="flex items-center justify-between px-[120px] py-5">
        <Link href="/" className="shrink-0">
          {logo?.url && (
            <Image
              src={logo.url}
              alt="Logo"
              width={logo.width ?? 160}
              height={logo.height ?? 48}
              className="h-14 w-auto"
              // The uploaded logo is expected to be a plain black mark on a
              // transparent background — inverting it gives white for free
              // over the dark hero, with no separate light-mode asset needed.
              style={{ filter: overHero ? "invert(1)" : "none" }}
              priority
            />
          )}
        </Link>

        <ul className="flex items-center gap-8">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="font-satoshi text-sm relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
