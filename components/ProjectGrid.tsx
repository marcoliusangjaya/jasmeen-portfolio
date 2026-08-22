"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SmartFillImage } from "./SmartImage";

export type Project = {
  _id: string;
  title: string;
  slug: string;
  categories: string[];
  location?: string;
  coverImage?: string;
  coverVideo?: string;
  thumbnailSize?: "small" | "medium" | "large" | "full";
};

// Experiment: how non-matching cards read when a filter is active.
// "fade" is the original look; "solid" blocks them out with the accent color.
// Flip this one value to revert.
const DIM_STYLE: "fade" | "solid" = "solid";

// Matches the grid-cols-2 md:grid-cols-3 lg:grid-cols-4 breakpoints below —
// tracked in JS because the border/box-shadow logic needs to know the
// *actual* column count to suppress the right sides at each breakpoint.
function columnsForWidth(width: number) {
  if (width < 768) return 2;
  if (width < 1024) return 3;
  return 4;
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const onResize = () => setCols(columnsForWidth(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filters = Array.from(
    new Set(projects.flatMap((p) => p.categories ?? []).filter(Boolean))
  );

  function toggle(filter: string) {
    setActive((prev) => (prev === filter ? null : filter));
  }

  if (projects.length === 0) return null;

  // When a filter is active, matching projects move to the top (stable
  // order preserved within each group); non-matching stay in place below,
  // blacked out.
  const displayProjects =
    active === null
      ? projects
      : [...projects].sort((a, b) => {
          const aMatch = (a.categories ?? []).includes(active) ? 0 : 1;
          const bMatch = (b.categories ?? []).includes(active) ? 0 : 1;
          return aMatch - bMatch;
        });

  return (
    <section className="px-6 sm:px-10 md:px-16 lg:px-[120px] py-10 md:py-16">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 md:mb-12">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => toggle(f)}
            className={`font-satoshi text-xs tracking-wide px-5 py-2 rounded-full border-[1.5px] transition-colors duration-200 ${
              active === f
                ? "bg-filterSelectedBg text-filterSelectedText border-filterOutline"
                : "bg-transparent text-filterText border-filterOutline hover:bg-filterHoverBg hover:text-filterHoverText hover:border-filterHoverBg"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayProjects.map((project, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const dimmed = active !== null && !(project.categories ?? []).includes(active);
          const highlighted = active !== null && !dimmed;

          const leftNeighbour = col > 0 ? displayProjects[index - 1] : null;
          const topNeighbour  = row > 0 ? displayProjects[index - cols] : null;

          const isHL = (p: typeof displayProjects[0] | null | undefined) =>
            !!p && active !== null && !!(p.categories ?? []).includes(active);

          // Box-shadow simulates the missing left/top "borders" on active cards
          // without touching real borders — so layout never shifts.
          // Skip the shadow side when the neighbour is also active (their right/bottom real border covers it).
          const shadowParts: string[] = [];
          if (highlighted && col > 0 && !isHL(leftNeighbour)) shadowParts.push("-1.5px 0 0 0 var(--color-grid-outline)");
          if (highlighted && row > 0 && !isHL(topNeighbour))  shadowParts.push("0 -1.5px 0 0 var(--color-grid-outline)");
          const boxShadow = shadowParts.join(", ") || undefined;
          const unclickable = dimmed && DIM_STYLE === "solid";

          return (
            <Link
              key={project._id}
              href={`/projects/${project.slug}`}
              style={boxShadow ? { boxShadow } : undefined}
              aria-disabled={unclickable || undefined}
              tabIndex={unclickable ? -1 : undefined}
              onClick={(e) => unclickable && e.preventDefault()}
              className={`group relative bg-bg aspect-square flex flex-col overflow-hidden
                border-[1.5px] border-gridOutline transition-opacity duration-300
                ${col > 0 ? "border-l-0" : ""}
                ${row > 0 ? "border-t-0" : ""}
                ${unclickable ? "pointer-events-none cursor-default" : ""}
                ${dimmed && DIM_STYLE === "fade" ? "opacity-25 z-0" : highlighted ? "z-10" : "z-0"}`}
            >
              {dimmed && DIM_STYLE === "solid" && (
                <div className="absolute inset-0 bg-filteredBlock z-20" />
              )}
              <div className="h-full flex flex-col">
                {/* Meta row — stacks on narrow cards so location can't get clipped */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between px-3 pt-3 pb-1 gap-0.5 sm:gap-1 shrink-0">
                  <span className="font-satoshi text-[8px] sm:text-[9px] md:text-[10px] tracking-widest uppercase text-gridText/60 leading-tight">
                    {(project.categories ?? []).join(" · ")}
                  </span>
                  {project.location && (
                    <span className="font-satoshi text-[8px] sm:text-[9px] md:text-[10px] text-gridText/40 sm:text-right shrink-0">
                      {project.location}
                    </span>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="flex-1 flex items-center justify-center min-h-0 p-3">
                  <div className={`relative aspect-square ${{ small: "w-1/3", medium: "w-1/2", large: "w-[70%]", full: "w-[90%]" }[project.thumbnailSize ?? "medium"]}`}>
                    {project.coverVideo ? (
                      <video
                        src={project.coverVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    ) : project.coverImage ? (
                      <SmartFillImage
                        src={project.coverImage}
                        alt={project.title}
                        objectFit="contain"
                        sizes="12vw"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="px-3 pb-3 shrink-0">
                  <h3 className="font-cabinet text-[12px] sm:text-[13px] md:text-[15px] font-medium leading-snug line-clamp-2 transition-colors duration-200 text-gridText group-hover:text-gridText/40">
                    {project.title}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
