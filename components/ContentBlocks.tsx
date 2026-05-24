"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type ContentLayout =
  | "large-top-6"
  | "large-bottom-6"
  | "large-top-4"
  | "large-bottom-4"
  | "five-grid"
  | "three-col"
  | "two-col"
  | "single";

type Section = {
  caption?: string;
  layout?: ContentLayout;
  images?: string[];
};

type MockupImage = {
  url: string;
  width?: number;
  height?: number;
};

type MockupRow = {
  images?: MockupImage[];
};

const B = "border-[1.5px] border-[#1A1A18]";

/* ─── Bento image cell ──────────────────────────────────────────────────────── */

function Cell({
  src,
  sizes,
  className = "",
  onOpen,
}: {
  src?: string;
  sizes: string;
  className?: string;
  onOpen: (src: string) => void;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-border/10 ${className} ${src ? "cursor-zoom-in" : ""}`}
      onClick={() => src && onOpen(src)}
    >
      {src && (
        <Image src={src} alt="" fill className="object-cover" sizes={sizes} />
      )}
    </div>
  );
}

/* ─── Bento section layouts ─────────────────────────────────────────────────── */

function BentoSection({
  section,
  isFirst,
  onOpen,
}: {
  section: Section;
  isFirst: boolean;
  onOpen: (src: string) => void;
}) {
  const imgs = section.images ?? [];
  const outer = `${B}${isFirst ? "" : " border-t-0"}`;
  const c = (src: string | undefined, cls: string, sizes: string) => (
    <Cell src={src} className={cls} sizes={sizes} onOpen={onOpen} />
  );

  switch (section.layout) {
    case "large-top-6":
      return (
        <div className={outer}>
          {c(imgs[0], "aspect-[16/9]", "100vw")}
          <div className={`grid grid-cols-2 border-t-[1.5px] border-[#1A1A18]`}>
            {c(imgs[1], "aspect-square", "50vw")}
            <div className={`${B} border-t-0 border-r-0 border-b-0 grid grid-cols-2`}>
              {c(imgs[2], "aspect-square", "25vw")}
              {c(imgs[3], "aspect-square border-l-[1.5px] border-[#1A1A18]", "25vw")}
              {c(imgs[4], "aspect-square border-t-[1.5px] border-[#1A1A18]", "25vw")}
              {c(imgs[5], "aspect-square border-l-[1.5px] border-t-[1.5px] border-[#1A1A18]", "25vw")}
            </div>
          </div>
        </div>
      );

    case "large-bottom-6":
      return (
        <div className={outer}>
          <div className="grid grid-cols-2 border-b-[1.5px] border-[#1A1A18]">
            <div className="grid grid-cols-2">
              {c(imgs[0], "aspect-square", "25vw")}
              {c(imgs[1], "aspect-square border-l-[1.5px] border-[#1A1A18]", "25vw")}
              {c(imgs[2], "aspect-square border-t-[1.5px] border-[#1A1A18]", "25vw")}
              {c(imgs[3], "aspect-square border-l-[1.5px] border-t-[1.5px] border-[#1A1A18]", "25vw")}
            </div>
            {c(imgs[4], "aspect-square border-l-[1.5px] border-[#1A1A18]", "50vw")}
          </div>
          {c(imgs[5], "aspect-[16/9]", "100vw")}
        </div>
      );

    case "large-top-4":
      return (
        <div className={outer}>
          {c(imgs[0], "aspect-[16/9]", "100vw")}
          <div className="grid grid-cols-2 border-t-[1.5px] border-[#1A1A18]">
            {c(imgs[1], "aspect-square", "50vw")}
            <div className="border-l-[1.5px] border-[#1A1A18]">
              {c(imgs[2], "aspect-[2/1]", "50vw")}
              {c(imgs[3], "aspect-[2/1] border-t-[1.5px] border-[#1A1A18]", "50vw")}
            </div>
          </div>
        </div>
      );

    case "large-bottom-4":
      return (
        <div className={outer}>
          <div className="grid grid-cols-2 border-b-[1.5px] border-[#1A1A18]">
            <div>
              {c(imgs[0], "aspect-[2/1]", "50vw")}
              {c(imgs[1], "aspect-[2/1] border-t-[1.5px] border-[#1A1A18]", "50vw")}
            </div>
            {c(imgs[2], "aspect-square border-l-[1.5px] border-[#1A1A18]", "50vw")}
          </div>
          {c(imgs[3], "aspect-[16/9]", "100vw")}
        </div>
      );

    case "five-grid":
      return (
        <div className={outer}>
          <div className="grid grid-cols-2 border-b-[1.5px] border-[#1A1A18]">
            {c(imgs[0], "aspect-[4/3]", "50vw")}
            {c(imgs[1], "aspect-[4/3] border-l-[1.5px] border-[#1A1A18]", "50vw")}
          </div>
          <div className="grid grid-cols-3">
            {c(imgs[2], "aspect-square", "33vw")}
            {c(imgs[3], "aspect-square border-l-[1.5px] border-[#1A1A18]", "33vw")}
            {c(imgs[4], "aspect-square border-l-[1.5px] border-[#1A1A18]", "33vw")}
          </div>
        </div>
      );

    case "three-col":
      return (
        <div className={`grid grid-cols-3 ${outer}`}>
          {c(imgs[0], "aspect-[3/4]", "33vw")}
          {c(imgs[1], "aspect-[3/4] border-l-[1.5px] border-[#1A1A18]", "33vw")}
          {c(imgs[2], "aspect-[3/4] border-l-[1.5px] border-[#1A1A18]", "33vw")}
        </div>
      );

    case "two-col":
      return (
        <div className={`grid grid-cols-2 ${outer}`}>
          {c(imgs[0], "aspect-[4/3]", "50vw")}
          {c(imgs[1], "aspect-[4/3] border-l-[1.5px] border-[#1A1A18]", "50vw")}
        </div>
      );

    case "single":
    default:
      return (
        <div className={outer}>
          {c(imgs[0], "aspect-[16/9]", "100vw")}
        </div>
      );
  }
}

/* ─── Mockup rows ───────────────────────────────────────────────────────────── */

function MockupRows({
  rows,
  onOpen,
}: {
  rows: MockupRow[];
  onOpen: (src: string) => void;
}) {
  if (rows.length === 0) return null;

  const colsClass: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };

  return (
    <div className="px-[60px] flex flex-col gap-2 mt-16">
      {rows.map((row, i) => {
        const imgs = (row.images ?? []).filter((img) => img.url);
        if (imgs.length === 0) return null;
        const n = Math.min(imgs.length, 3) as 1 | 2 | 3;
        return (
          <div key={i} className={`grid ${colsClass[n]} gap-2`}>
            {imgs.map((img, j) => (
              <div
                key={j}
                className="relative overflow-hidden cursor-zoom-in"
                onClick={() => onOpen(img.url)}
              >
                <Image
                  src={img.url}
                  alt=""
                  width={img.width ?? 1200}
                  height={img.height ?? 800}
                  style={{ width: "100%", height: "auto" }}
                  className="block"
                  sizes={n === 1 ? "80vw" : n === 2 ? "40vw" : "27vw"}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Lightbox ──────────────────────────────────────────────────────────────── */

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-6 text-white/70 hover:text-white text-3xl leading-none font-light"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <div
        className="relative max-w-[90vw] max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={src} alt="" fill className="object-contain" sizes="90vw" priority />
      </div>
    </div>
  );
}

/* ─── Public export ─────────────────────────────────────────────────────────── */

export default function ContentBlocks({
  sections,
  mockupRows = [],
}: {
  sections: Section[];
  mockupRows?: MockupRow[];
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const hasSections = sections.length > 0;
  const hasMockups = mockupRows.length > 0;

  if (!hasSections && !hasMockups) return null;

  return (
    <>
      <div className="py-12">
        {/* Bento sections */}
        {hasSections && (
          <div className="px-[120px]">
            {sections.map((section, i) => (
              <div key={i}>
                {section.caption && (
                  <p className={`font-satoshi text-xs tracking-widest uppercase text-[#1A1A18]/50 ${i > 0 ? "mt-16" : ""} mb-4`}>
                    {section.caption}
                  </p>
                )}
                <BentoSection
                  section={section}
                  isFirst={i === 0 || !!section.caption}
                  onOpen={setLightboxSrc}
                />
              </div>
            ))}
          </div>
        )}

        {/* Mockup rows */}
        {hasMockups && (
          <MockupRows rows={mockupRows} onOpen={setLightboxSrc} />
        )}
      </div>

      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
}
