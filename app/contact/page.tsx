import { client } from "@/sanity/client";
import { contactQuery } from "@/sanity/queries";
import Footer from "@/components/Footer";

export const revalidate = 60;

type SocialLink = { platform: string; url: string };
type ContactData = { email?: string; socialLinks?: SocialLink[] };

export default async function ContactPage() {
  const data: ContactData = (await client.fetch(contactQuery)) ?? {};
  const hasContent = data.email || (data.socialLinks && data.socialLinks.length > 0);

  return (
    <>
      <main className="px-[120px] pt-32 pb-24">
        <h1 className="font-cabinet text-4xl md:text-5xl font-medium mb-12">
          Get In Touch
        </h1>

        {hasContent ? (
          <div className="flex flex-col gap-10 max-w-md">
            {data.email && (
              <div className="flex flex-col gap-2">
                <span className="font-satoshi text-xs tracking-widest uppercase text-text/40">
                  Email
                </span>
                <a
                  href={`mailto:${data.email}`}
                  className="font-cabinet text-2xl w-fit hover:text-text/60 transition-colors"
                >
                  {data.email}
                </a>
              </div>
            )}

            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-satoshi text-xs tracking-widest uppercase text-text/40">
                  Socials
                </span>
                <div className="flex flex-col gap-2">
                  {data.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-cabinet text-2xl w-fit hover:text-text/60 transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="font-satoshi text-sm text-text/60">
            Contact info coming soon.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
