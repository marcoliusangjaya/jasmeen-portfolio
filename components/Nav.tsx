import Link from "next/link";

const links = [
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-[#F5F5F5] border-b-[1.5px] border-[#D0CBC2]">
      <nav className="flex items-center justify-between px-[120px] py-5">
        <Link
          href="/"
          className="font-cabinet text-lg font-medium tracking-widest uppercase"
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
