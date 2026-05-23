import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import { aboutQuery } from "@/sanity/queries";
import Footer from "@/components/Footer";

export const revalidate = 60;

type Credential = { degree: string; school: string };
type AboutData = {
  name?: string;
  bio?: string;
  polaroidPhoto?: string;
  credentials?: Credential[];
  skills?: string[];
};

const DEFAULT_FILTERS = [
  "Branding",
  "Events/Experiential",
  "Creative Technology",
  "Photo/Video",
  "Strategy",
];

export default async function AboutPage() {
  const about: AboutData = (await client.fetch(aboutQuery)) ?? {};
  const filters = about.skills?.length ? about.skills : DEFAULT_FILTERS;

  return (
    <>
      <main className="px-[120px]">
        {/* Top — polaroid left, name right */}
        <section className="pt-24 pb-20 grid grid-cols-2 gap-16 items-start">
          {/* Polaroid */}
          <div className="flex justify-start">
            <div className="bg-white p-4 pb-10 shadow-xl rotate-[-2deg] w-72 shrink-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-border/20">
                {about.polaroidPhoto ? (
                  <Image
                    src={about.polaroidPhoto}
                    alt={about.name ?? "Jasmeen"}
                    fill
                    className="object-cover"
                    sizes="288px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-border/30" />
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="flex items-end pb-2">
            <h1 className="font-cabinet text-3xl md:text-4xl font-medium tracking-widest uppercase leading-tight">
              {about.name ?? "Jasmeen Shaqueita"}
            </h1>
          </div>
        </section>

        {/* Bio + Credentials */}
        <section className="py-14 grid grid-cols-[2fr_1fr] gap-16 border-t border-border">
          <p className="font-satoshi text-base leading-relaxed text-justify text-text/80">
            {about.bio ??
              "Multidisciplinary creative working across brand identity, experience design, and creative technology. With a background spanning film, branding, and marketing strategy, I work across the full arc of a project; from identity systems to the interactive moment people remember."}
          </p>

          <div className="flex flex-col gap-7">
            {(about.credentials && about.credentials.length > 0
              ? about.credentials
              : [
                  {
                    degree: "BFA Film & Television",
                    school: "Savannah College of Arts and Design",
                  },
                  {
                    degree: "MSc Marketing & Creativity",
                    school: "ESCP Business School",
                  },
                ]
            ).map((c, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="font-satoshi text-base leading-relaxed text-text">{c.degree}</span>
                <span className="font-satoshi text-base leading-relaxed tracking-widest uppercase text-text/60">
                  {c.school}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Filter pills — link to homepage */}
        <section className="py-14 border-t border-border">
          <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
              <Link
                key={f}
                href="/"
                className="font-satoshi text-xs tracking-wide px-5 py-2 rounded-full border-[1.5px] border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F4F3DE] transition-colors duration-200"
              >
                {f}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
