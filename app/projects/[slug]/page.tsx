import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { projectBySlugQuery, projectsQuery } from "@/sanity/queries";
import Footer from "@/components/Footer";
import ContentBlocks from "@/components/ContentBlocks";
import type { Project } from "@/components/ProjectGrid";

export const revalidate = 0;

type HeroLayout =
  | "classic"
  | "four-grid"
  | "large-right"
  | "large-left-two-right"
  | "two-col"
  | "single";

type Section = {
  layout?: "three-large-top" | "three-large-bottom" | "five-grid" | "large-top-6" | "large-bottom-6" | "two-stacked" | "single";
  items?: { image?: string; label?: string }[];
};

type MockupImage = { url: string; width?: number; height?: number };
type MockupRow = { images?: MockupImage[] };

type ProjectDetail = Project & {
  date?: string;
  subheading?: string;
  description?: string;
  heroLayout?: HeroLayout;
  heroImages?: string[];
  sections?: Section[];
  mockupRows?: MockupRow[];
  otherWork?: Project[];
};

export async function generateStaticParams() {
  const projects: { slug: string }[] = await client.fetch(projectsQuery);
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project: ProjectDetail = await client.fetch(projectBySlugQuery, {
    slug: params.slug,
  });

  if (!project) notFound();

  const heroImages = project.heroImages?.length
    ? project.heroImages
    : ([project.coverImage].filter(Boolean) as string[]);

  return (
    <>
      <main>
        {/* Hero — full bleed, bleeds behind transparent nav */}
        <div className="-mt-[68px]">
          <HeroGrid images={heroImages} layout={project.heroLayout ?? "single"} />
        </div>

        {/* Title block */}
        <section className="px-[120px] pt-12 pb-16">
          <div className="flex items-start justify-between gap-8 mb-6">
            <div className="flex flex-col gap-3 max-w-2xl">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {(project.categories ?? []).map((cat) => (
                  <span
                    key={cat}
                    className="font-satoshi text-xs tracking-widest uppercase px-4 py-1.5 border-[1.5px] border-[#1A1A18] rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="font-cabinet text-4xl md:text-5xl font-medium leading-tight">
                {project.title}
              </h1>
              {project.subheading && (
                <p className="font-satoshi text-lg text-text/60 leading-snug">
                  {project.subheading}
                </p>
              )}
            </div>
            <div className="text-right shrink-0 pt-1">
              {project.location && (
                <p className="font-satoshi text-sm text-text/60">{project.location}</p>
              )}
              {project.date && (
                <p className="font-satoshi text-sm text-text/40 mt-0.5">{project.date}</p>
              )}
            </div>
          </div>

          {project.description && (
            <div className="font-satoshi text-sm leading-relaxed text-text/70 max-w-2xl space-y-4">
              {project.description.split("\n\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </section>

        {/* Content blocks */}
        <ContentBlocks
          sections={project.sections ?? []}
          mockupRows={project.mockupRows ?? []}
        />

        {/* Other Work */}
        {project.otherWork && project.otherWork.length > 0 && (
          <OtherWork projects={project.otherWork} />
        )}
      </main>
      <Footer />
    </>
  );
}

/* ─── Hero layouts ─────────────────────────────────────────────────────────── */

function HeroGrid({ images, layout }: { images: string[]; layout: HeroLayout }) {
  const [a, b, c, d] = images;

  if (layout === "single" || images.length <= 1) {
    return (
      <div className="relative w-full h-[calc(100vh-100px)]">
        <ImgCell src={a} sizes="100vw" className="absolute inset-0" />
      </div>
    );
  }

  if (layout === "two-col") {
    return (
      <div className="grid grid-cols-2 h-[calc(100vh-100px)]">
        <ImgCell src={a} sizes="50vw" />
        <ImgCell src={b} sizes="50vw" />
      </div>
    );
  }

  if (layout === "four-grid") {
    return (
      <div className="grid grid-cols-2 grid-rows-2 h-[calc(100vh-100px)]">
        <ImgCell src={a} sizes="50vw" />
        <ImgCell src={b} sizes="50vw" />
        <ImgCell src={c} sizes="50vw" />
        <ImgCell src={d} sizes="50vw" />
      </div>
    );
  }

  if (layout === "large-right") {
    return (
      <div className="grid grid-cols-2 h-[calc(100vh-100px)]">
        <div className="grid grid-rows-2">
          <ImgCell src={a} sizes="50vw" />
          <ImgCell src={b} sizes="50vw" />
        </div>
        <ImgCell src={c} sizes="50vw" />
      </div>
    );
  }

  if (layout === "large-left-two-right") {
    return (
      <div className="grid grid-cols-2 h-[calc(100vh-100px)]">
        <ImgCell src={a} sizes="50vw" />
        <div className="grid grid-rows-2">
          <ImgCell src={b} sizes="50vw" />
          <ImgCell src={c} sizes="50vw" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 h-[calc(100vh-100px)]">
      <ImgCell src={a} sizes="50vw" />
      <div className="grid grid-rows-2">
        <ImgCell src={b} sizes="50vw" />
        <div className="grid grid-cols-2">
          <ImgCell src={c} sizes="25vw" />
          <ImgCell src={d} sizes="25vw" />
        </div>
      </div>
    </div>
  );
}

/* ─── Other Work ────────────────────────────────────────────────────────────── */

function OtherWork({ projects }: { projects: Project[] }) {
  return (
    <section className="px-[120px] py-20">
      <h2 className="font-cabinet text-2xl font-medium mb-12 text-center">
        Other Work
      </h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-2 w-1/2">
          {projects.slice(0, 2).map((p, index) => (
            <Link
              key={p._id}
              href={`/projects/${p.slug}`}
              className={`group bg-[#F0F1ED] aspect-square flex flex-col overflow-hidden transition-opacity duration-300
                border-[1.5px] border-[#1A1A18]
                ${index > 0 ? "border-l-0" : ""}`}
            >
              <div className="transition-transform duration-300 ease-out group-hover:scale-[1.02] origin-center h-full flex flex-col">
                <div className="flex items-start justify-between px-3 pt-3 pb-1 gap-1 shrink-0">
                  <span className="font-satoshi text-[9px] tracking-widest uppercase text-[#1A1A18]/60 leading-tight">
                    {(p.categories ?? []).join(" · ")}
                  </span>
                  {p.location && (
                    <span className="font-satoshi text-[9px] text-[#1A1A18]/40 text-right shrink-0">
                      {p.location}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-center min-h-0 p-3">
                  <div className="relative w-1/2 aspect-square">
                    {p.coverVideo ? (
                      <video
                        src={p.coverVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    ) : p.coverImage ? (
                      <Image
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        className="object-contain"
                        sizes="25vw"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                </div>
                <div className="px-3 pb-3 shrink-0">
                  <h3 className="font-cabinet text-sm font-medium leading-snug line-clamp-2">
                    {p.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Shared image cell (hero only) ─────────────────────────────────────────── */

function ImgCell({
  src,
  alt = "",
  sizes,
  className = "",
}: {
  src?: string;
  alt?: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#F0F1ED] ${className}`}>
      {src && (
        <Image src={src} alt={alt} fill className="object-contain" sizes={sizes} />
      )}
    </div>
  );
}
