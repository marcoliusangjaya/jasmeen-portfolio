import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { projectBySlugQuery, projectsQuery } from "@/sanity/queries";
import Footer from "@/components/Footer";
import ContentBlocks from "@/components/ContentBlocks";
import { SmartFillImage } from "@/components/SmartImage";
import type { Project } from "@/components/ProjectGrid";

export const revalidate = 0;

type Section = {
  layout?:
    | "single"
    | "two-stacked"
    | "two-side-by-side"
    | "three-large-top"
    | "three-large-bottom"
    | "three-side-by-side"
    | "three-stacked"
    | "four-grid-2x2"
    | "four-top3-bottom1"
    | "four-top1-bottom3"
    | "five-grid"
    | "five-top3-bottom2"
    | "large-top-6"
    | "large-bottom-6";
  items?: { image?: string; label?: string }[];
};

type MockupItem = { url?: string; width?: number; height?: number; videoUrl?: string };
type MockupRow = { items?: MockupItem[] };

type RelatedLink = { label: string; url: string };

type ProjectDetail = Project & {
  date?: string;
  tools?: string[];
  subheading?: string;
  description?: string;
  relatedLinks?: RelatedLink[];
  sections?: Section[];
  mockupRows?: MockupRow[];
};

export async function generateStaticParams() {
  const projects: { slug: string }[] = await client.fetch(projectsQuery);
  return projects.map((p) => ({ slug: p.slug }));
}

// Simple deterministic string hash (djb2-ish) — used to shuffle the project
// order once, consistently, rather than pulling Math.random() per request.
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

// Picks 2 "Other Work" projects per page automatically: the pairing comes
// from a fixed pseudo-random shuffle of all projects (so it doesn't read as
// "next in the admin-curated list"), then takes the next 2 after the
// current project in that shuffled, wrapping order. Because every project
// gets a fixed position in one cycle, every project is guaranteed to show
// up as someone's Other Work — no manual curation needed.
function getOtherWork(allProjects: Project[], currentSlug: string): Project[] {
  const shuffled = [...allProjects].sort((a, b) => hashString(a._id) - hashString(b._id));
  const idx = shuffled.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return [];
  const others: Project[] = [];
  for (let offset = 1; offset < shuffled.length && others.length < 2; offset++) {
    others.push(shuffled[(idx + offset) % shuffled.length]);
  }
  return others;
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const [project, allProjects]: [ProjectDetail, Project[]] = await Promise.all([
    client.fetch(projectBySlugQuery, { slug: params.slug }),
    client.fetch(projectsQuery),
  ]);

  if (!project) notFound();

  const otherWork = getOtherWork(allProjects, params.slug);

  return (
    <>
      <main>
        {/* Title block */}
        <section className="px-6 sm:px-10 md:px-16 lg:px-[120px] pt-10 md:pt-12 pb-12 md:pb-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8 mb-6">
            <div className="flex flex-col max-w-2xl">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2 mb-6 md:mb-10">
                {(project.categories ?? []).map((cat) => (
                  <span
                    key={cat}
                    className="font-satoshi text-xs tracking-widest uppercase px-4 py-1.5 border-[1.5px] border-gridOutline rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="font-cabinet text-3xl sm:text-4xl md:text-5xl font-medium leading-tight">
                  {project.title}
                </h1>
                {project.subheading && (
                  <p className="font-satoshi text-base md:text-lg text-text/60 leading-snug">
                    {project.subheading}
                  </p>
                )}
              </div>
            </div>
            <div className="text-left md:text-right shrink-0 md:pt-1">
              {project.location && (
                <p className="font-satoshi text-sm text-text/60">{project.location}</p>
              )}
              {project.date && (
                <p className="font-satoshi text-sm text-text/40 mt-0.5">{project.date}</p>
              )}
              {project.tools && project.tools.length > 0 && (
                <div className="flex flex-wrap justify-start md:justify-end gap-1.5 mt-3 max-w-full md:max-w-[220px]">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="font-satoshi text-[10px] tracking-wide uppercase text-text/50 border border-text/20 rounded-full px-2.5 py-1"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
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

          {project.relatedLinks && project.relatedLinks.length > 0 && (
            <div className="mt-8">
              <h3 className="font-satoshi text-xs tracking-widest uppercase text-text/40 mb-3">
                Related Links
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.relatedLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-satoshi text-xs tracking-wide px-5 py-2 rounded-full border-[1.5px] border-filterOutline bg-filterSelectedBg text-filterSelectedText hover:bg-bg hover:text-filterText transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Content blocks */}
        <ContentBlocks
          sections={project.sections ?? []}
          mockupRows={project.mockupRows ?? []}
        />

        {/* Other Work */}
        {otherWork.length > 0 && <OtherWork projects={otherWork} />}
      </main>
      <Footer />
    </>
  );
}

/* ─── Other Work ────────────────────────────────────────────────────────────── */

function OtherWork({ projects }: { projects: Project[] }) {
  return (
    <section className="px-6 sm:px-10 md:px-16 lg:px-[120px] py-14 md:py-20">
      <h2 className="font-cabinet text-xl md:text-2xl font-medium mb-8 md:mb-12 text-center">
        Other Work
      </h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-2 w-full sm:w-1/2">
          {projects.slice(0, 2).map((p, index) => (
            <Link
              key={p._id}
              href={`/projects/${p.slug}`}
              className={`group bg-bg aspect-square flex flex-col overflow-hidden transition-opacity duration-300
                border-[1.5px] border-gridOutline
                ${index > 0 ? "border-l-0" : ""}`}
            >
              <div className="h-full flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between px-3 pt-3 pb-1 gap-0.5 sm:gap-1 shrink-0">
                  <span className="font-satoshi text-[9px] tracking-widest uppercase text-gridText/60 leading-tight">
                    {(p.categories ?? []).join(" · ")}
                  </span>
                  {p.location && (
                    <span className="font-satoshi text-[9px] text-gridText/40 sm:text-right shrink-0">
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
                      <SmartFillImage
                        src={p.coverImage}
                        alt={p.title}
                        objectFit="contain"
                        sizes="25vw"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                </div>
                <div className="px-3 pb-3 shrink-0">
                  <h3 className="font-cabinet text-[11px] sm:text-sm font-medium leading-snug line-clamp-2 transition-colors duration-200 text-gridText group-hover:text-gridText/40">
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
