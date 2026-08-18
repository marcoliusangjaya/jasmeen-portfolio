import { client } from "@/sanity/client";
import { footerQuery } from "@/sanity/queries";

type SocialLink = { platform: string; url: string };

export default async function Footer() {
  const data: { socialLinks?: SocialLink[] } | null =
    await client.fetch(footerQuery);
  const links: SocialLink[] = data?.socialLinks ?? [];

  return (
    <footer className="py-14 px-[120px] flex justify-end bg-footerBg">
      <div className="w-full max-w-xs">
        <h2 className="font-cabinet text-xl text-footerText mb-6">Reach Out</h2>

        {/* Email input — pill shaped */}
        <form className="flex items-center rounded-full border border-footerText/25 overflow-hidden mb-5">
          <input
            type="email"
            placeholder="Enter Your Email..."
            className="flex-1 bg-transparent font-satoshi text-sm text-footerText/70 placeholder:text-footerText/35 px-5 py-3 outline-none"
          />
          <button
            type="submit"
            className="font-satoshi text-sm text-footerText/70 px-5 py-3 hover:text-footerText transition-colors shrink-0"
          >
            OK
          </button>
        </form>

        {/* Social links from Sanity */}
        <div className="flex flex-col gap-2">
          {links.length > 0 ? (
            links.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-satoshi text-sm text-footerText/60 hover:text-footerText transition-colors w-fit"
              >
                {link.platform}
              </a>
            ))
          ) : (
            <>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-satoshi text-sm text-footerText/60 hover:text-footerText transition-colors w-fit"
              >
                Instagram
              </a>
              <a
                href="#"
                className="font-satoshi text-sm text-footerText/60 hover:text-footerText transition-colors w-fit"
              >
                Kuno + Kini
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
