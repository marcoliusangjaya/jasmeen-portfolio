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
      <div className="border-[1.5px] border-[#1A1A18]">
        <div className="grid grid-cols-4 gap-[1.5px] bg-[#1A1A18]">
        {projects.map((project) => {
          const dimmed = active !== null && !(project.categories ?? []).includes(active);
          return (
            <Link
              key={project._id}
              href={`/projects/${project.slug}`}
              className="group relative bg-[#F0F1ED] aspect-square flex flex-col overflow-hidden"
            >
              {dimmed && (
                <div className="absolute inset-0 bg-white/75 z-20 pointer-events-none transition-opacity duration-300" />
              )}
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
      </div>
    </section>
  );
}
