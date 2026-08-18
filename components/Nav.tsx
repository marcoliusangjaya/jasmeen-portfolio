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

  // On the homepage the nav overlays the purple hero (so the hero can still
  // bleed to the very top) with light text; elsewhere it's the original
  // in-flow sticky nav with dark text.
  const overHero = isHome && !scrolled;

  return (
    <header
      className={`${isHome ? "fixed inset-x-0" : "sticky"} top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#F0F1ED]" : "bg-transparent"
      } ${overHero ? "text-accent-text" : "text-text"}`}
    >
      <nav className="flex items-center justify-between px-[120px] py-5">
        <Link
          href="/"
          className="font-cabinet text-2xl font-medium tracking-widest uppercase"
        >
          Jasmeen Shaqueita
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
