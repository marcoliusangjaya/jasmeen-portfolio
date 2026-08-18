"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  // On the homepage the nav stays out of the way until the hero title has
  // scrolled past — everywhere else it behaves like the old always-sticky nav.
  const [pastHero, setPastHero] = useState(!isHome);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }
    const sentinel = document.getElementById("hero-end");
    if (!sentinel) {
      setPastHero(true);
      return;
    }
    setPastHero(false);
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome, pathname]);

  const hideOnHero = isHome && !pastHero;

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hideOnHero ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "bg-[#F0F1ED]" : "bg-transparent"}`}
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
                className="font-satoshi text-sm relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-text after:transition-all after:duration-300 hover:after:w-full"
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
