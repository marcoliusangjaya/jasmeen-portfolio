"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
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
      <nav className="flex items-center justify-end px-[120px] py-5">
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
