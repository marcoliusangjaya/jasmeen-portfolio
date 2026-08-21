import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import { aboutQuery } from "@/sanity/queries";
import Footer from "@/components/Footer";

export const revalidate = 60;

type Credential = { degree: string; school: string; year?: string };
type ToolCategory = { category: string; tools?: string[] };
type PolaroidPhoto = { url: string; width?: number; height?: number };
type AboutData = {
  name?: string;
  bio?: string;
  polaroidPhoto?: PolaroidPhoto;
  credentials?: Credential[];
  toolsByCategory?: ToolCategory[];
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
        {/* Top — polaroid left, name + bio right */}
        <section className="pt-24 pb-20 grid grid-cols-2 gap-16 items-start">
          {/* Polaroid — frame sizes itself to the photo's own aspect ratio, no cropping */}
          <div className="flex justify-start">
            <div className="bg-white p-4 pb-10 shadow-xl rotate-[-2deg] w-96 shrink-0">
              <div
                className="relative w-full overflow-hidden bg-border/20"
                style={{
                  aspectRatio:
                    about.polaroidPhoto?.width && about.polaroidPhoto?.height
                      ? `${about.polaroidPhoto.width} / ${about.polaroidPhoto.height}`
                      : "3 / 4",
                }}
              >
                {about.polaroidPhoto?.url ? (
                  <Image
                    src={about.polaroidPhoto.url}
                    alt={about.name ?? "Jasmeen"}
                    fill
                    className="object-cover"
                    sizes="384px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-border/30" />
                )}
              </div>
            </div>
          </div>

          {/* Name + bio */}
          <div className="flex flex-col gap-6">
            <h1 className="font-cabinet text-3xl md:text-4xl font-medium tracking-widest uppercase leading-tight">
              {about.name ?? "Jasmeen Shaqueita"}
            </h1>
            <p className="font-satoshi text-base leading-relaxed text-left text-text/80">
              {about.bio ??
                "Multidisciplinary creative working across brand identity, experience design, and creative technology. With a background spanning film, branding, and marketing strategy, I work across the full arc of a project; from identity systems to the interactive moment people remember."}
            </p>
          </div>
        </section>

        {/* Tools + Education Credentials */}
        <section className="py-14 grid grid-cols-2 gap-16 border-t border-border">
          <div className="flex flex-col gap-7">
            {(about.toolsByCategory ?? []).map((tc, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="font-satoshi text-base leading-relaxed text-text">{tc.category}</span>
                <span className="font-satoshi text-sm leading-relaxed text-text/60">
                  {(tc.tools ?? []).join(", ")}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-7">
            {(about.credentials && about.credentials.length > 0
              ? about.credentials
              : [
                  {
                    degree: "BFA Film & Television",
                    school: "Savannah College of Arts and Design",
                    year: "2018–2022",
                  },
                  {
                    degree: "MSc Marketing & Creativity",
                    school: "ESCP Business School",
                    year: "2023",
                  },
                ]
            ).map((c, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="font-satoshi text-base leading-relaxed text-text">{c.degree}</span>
                <span className="font-satoshi text-base leading-relaxed tracking-widest uppercase text-text/60">
                  {c.school}
                </span>
                {c.year && (
                  <span className="font-satoshi text-sm leading-relaxed text-text/40">
                    {c.year}
                  </span>
                )}
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
                className="font-satoshi text-xs tracking-wide px-5 py-2 rounded-full border-[1.5px] border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F0F1ED] transition-colors duration-200"
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
