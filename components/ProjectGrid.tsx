"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export type Project = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  location?: string;
  coverImage?: string;
  coverVideo?: string;
};

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);

  const filters = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean))
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
          const dimmed = active !== null && project.category !== active;
          return (
            <Link
              key={project._id}
              href={`/projects/${project.slug}`}
              className={`group bg-[#F0F1ED] aspect-square flex flex-col overflow-hidden transition-opacity duration-300
                border-[1.5px] border-[#1A1A18]
                ${col > 0 ? "border-l-0" : ""}
                ${row > 0 ? "border-t-0" : ""}
                ${dimmed ? "opacity-25" : "opacity-100"}`}
            >
              <div className="transition-transform duration-300 ease-out group-hover:scale-[1.02] origin-center h-full flex flex-col">
                {/* Meta row */}
                <div className="flex items-start justify-between px-3 pt-3 pb-1 gap-1 shrink-0">
                  <span className="font-satoshi text-[10px] tracking-widest uppercase text-[#1A1A18]/60 leading-tight">
                    {project.category}
                  </span>
                  {project.location && (
                    <span className="font-satoshi text-[10px] text-[#1A1A18]/40 text-right shrink-0">
                      {project.location}
                    </span>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="flex-1 flex items-center justify-center min-h-0 p-3">
                  <div className="relative w-1/2 aspect-square">
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
                  <h3 className="font-cabinet text-[15px] font-medium leading-snug line-clamp-2">
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
