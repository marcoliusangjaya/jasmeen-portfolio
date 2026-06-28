"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);

  const filters = Array.from(
    new Set(projects.flatMap((p) => p.categories ?? []).filter(Boolean))
  );

  function toggle(filter: string) {
    setActive((prev) => (prev === filter ? null : filter));
  }

  if (projects.length === 0) return null;

  return (
    <section className="px-[120px] py-16">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-12">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => toggle(f)}
            className={`font-satoshi text-xs tracking-wide px-5 py-2 rounded-full border-[1.5px] transition-colors duration-200 ${
              active === f
                ? "bg-[#1A1A18] text-[#F0F1ED] border-[#1A1A18]"
                : "bg-transparent text-[#1A1A18] border-[#1A1A18] hover:bg-[#888] hover:text-white hover:border-[#888]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4">
        {projects.map((project, index) => {
          const col = index % 4;
          const row = Math.floor(index / 4);
          const dimmed = active !== null && !(project.categories ?? []).includes(active);
          const highlighted = active !== null && !dimmed;

          const leftNeighbour = col > 0 ? projects[index - 1] : null;
          const topNeighbour  = row > 0 ? projects[index - 4] : null;

          const isHL = (p: typeof projects[0] | null | undefined) =>
            !!p && active !== null && !!(p.categories ?? []).includes(active);

          // Box-shadow simulates the missing left/top "borders" on active cards
          // without touching real borders — so layout never shifts.
          // Skip the shadow side when the neighbour is also active (their right/bottom real border covers it).
          const shadowParts: string[] = [];
          if (highlighted && col > 0 && !isHL(leftNeighbour)) shadowParts.push("-1.5px 0 0 0 #1A1A18");
          if (highlighted && row > 0 && !isHL(topNeighbour))  shadowParts.push("0 -1.5px 0 0 #1A1A18");
          const boxShadow = shadowParts.join(", ") || undefined;

          return (
            <Link
              key={project._id}
              href={`/projects/${project.slug}`}
              style={boxShadow ? { boxShadow } : undefined}
              className={`group relative bg-[#F0F1ED] aspect-square flex flex-col overflow-hidden
                border-[1.5px] border-[#1A1A18] transition-opacity duration-300
                ${col > 0 ? "border-l-0" : ""}
                ${row > 0 ? "border-t-0" : ""}
                ${dimmed ? "opacity-25 z-0" : highlighted ? "z-10" : "z-0"}`}
            >
              <div className="h-full flex flex-col">
                {/* Meta row */}
                <div className="flex items-start justify-between px-3 pt-3 pb-1 gap-1 shrink-0">
                  <span className="font-satoshi text-[10px] tracking-widest uppercase text-[#1A1A18]/60 leading-tight">
                    {(project.categories ?? []).join(" · ")}
                  </span>
                  {project.location && (
                    <span className="font-satoshi text-[10px] text-[#1A1A18]/40 text-right shrink-0">
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
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-contain"
                        sizes="12vw"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="px-3 pb-3 shrink-0">
                  <h3 className="font-cabinet text-[15px] font-medium leading-snug line-clamp-2 transition-colors duration-200 text-[#1A1A18] group-hover:text-[#1A1A18]/40">
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
