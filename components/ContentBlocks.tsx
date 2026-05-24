"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type BentoItem = { image?: string; label?: string };

type Section = {
  layout?: "three-large-top" | "three-large-bottom" | "five-grid" | "large-top-6" | "large-bottom-6" | "two-stacked" | "single";
  items?: BentoItem[];
};

type MockupImage = { url: string; width?: number; height?: number };
type MockupRow = { images?: MockupImage[] };

const B = "border-[1.5px] border-[#1A1A18]";

/* ─── Single bento cell ─────────────────────────────────────────────────────── */

function Cell({
  item,
  sizes,
  imgClass = "",
  className = "",
  onOpen,
}: {
  item?: BentoItem;
  sizes: string;
  imgClass?: string;
  className?: string;
  onOpen: (src: string) => void;
}) {
  const src = item?.image;
  const label = item?.label;
  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative overflow-hidden ${imgClass} ${src ? "cursor-zoom-in" : ""}`}
        onClick={() => src && onOpen(src)}
      >
        {src && <Image src={src} alt={label ?? ""} fill className="object-cover" sizes={sizes} />}
        {label && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="font-satoshi text-xs tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] bg-black/30 px-2 py-0.5 rounded-sm">{label}</span>
          </div>
        )}
      </div>
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
  const items = section.items ?? [];
  const outer = `${B}${isFirst ? "" : " border-t-0"}`;

  switch (section.layout) {
    case "three-large-top":
      return (
        <div className={outer}>
          <Cell item={items[0]} sizes="100vw" imgClass="aspect-[16/9]" onOpen={onOpen} />
          <div className="grid grid-cols-2 border-t-[1.5px] border-[#1A1A18]">
            <Cell item={items[1]} sizes="50vw" imgClass="aspect-square" onOpen={onOpen} />
            <Cell item={items[2]} sizes="50vw" imgClass="aspect-square" className="border-l-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
          </div>
        </div>
      );

    case "three-large-bottom":
      return (
        <div className={outer}>
          <div className="grid grid-cols-2 border-b-[1.5px] border-[#1A1A18]">
            <Cell item={items[0]} sizes="50vw" imgClass="aspect-square" onOpen={onOpen} />
            <Cell item={items[1]} sizes="50vw" imgClass="aspect-square" className="border-l-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
          </div>
          <Cell item={items[2]} sizes="100vw" imgClass="aspect-[16/9]" onOpen={onOpen} />
        </div>
      );

    case "five-grid":
      return (
        <div className={outer}>
          <div className="grid grid-cols-2 border-b-[1.5px] border-[#1A1A18]">
            <Cell item={items[0]} sizes="50vw" imgClass="aspect-square" onOpen={onOpen} />
            <Cell item={items[1]} sizes="50vw" imgClass="aspect-square" className="border-l-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
          </div>
          <div className="grid grid-cols-3">
            <Cell item={items[2]} sizes="33vw" imgClass="aspect-square" onOpen={onOpen} />
            <Cell item={items[3]} sizes="33vw" imgClass="aspect-square" className="border-l-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
            <Cell item={items[4]} sizes="33vw" imgClass="aspect-square" className="border-l-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
          </div>
        </div>
      );

    case "large-top-6":
      return (
        <div className={outer}>
          <Cell item={items[0]} sizes="100vw" imgClass="aspect-[16/9]" onOpen={onOpen} />
          <div className="grid grid-cols-2 border-t-[1.5px] border-[#1A1A18]">
            <Cell item={items[1]} sizes="50vw" imgClass="aspect-square" onOpen={onOpen} />
            <div className="grid grid-rows-2 border-l-[1.5px] border-[#1A1A18]">
              <Cell item={items[2]} sizes="25vw" imgClass="aspect-square" onOpen={onOpen} />
              <Cell item={items[3]} sizes="25vw" imgClass="aspect-square" className="border-t-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
            </div>
          </div>
          <div className="grid grid-cols-2 border-t-[1.5px] border-[#1A1A18]">
            <Cell item={items[4]} sizes="25vw" imgClass="aspect-square" onOpen={onOpen} />
            <Cell item={items[5]} sizes="25vw" imgClass="aspect-square" className="border-l-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
          </div>
        </div>
      );

    case "large-bottom-6":
      return (
        <div className={outer}>
          <div className="grid grid-cols-2">
            <Cell item={items[0]} sizes="25vw" imgClass="aspect-square" onOpen={onOpen} />
            <div className="grid grid-rows-2 border-l-[1.5px] border-[#1A1A18]">
              <Cell item={items[1]} sizes="25vw" imgClass="aspect-square" onOpen={onOpen} />
              <Cell item={items[2]} sizes="25vw" imgClass="aspect-square" className="border-t-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
            </div>
          </div>
          <div className="grid grid-cols-2 border-t-[1.5px] border-[#1A1A18]">
            <Cell item={items[3]} sizes="25vw" imgClass="aspect-square" onOpen={onOpen} />
            <Cell item={items[4]} sizes="25vw" imgClass="aspect-square" className="border-l-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
          </div>
          <Cell item={items[5]} sizes="100vw" imgClass="aspect-[16/9]" className="border-t-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
        </div>
      );

    case "two-stacked":
      return (
        <div className={outer}>
          <Cell item={items[0]} sizes="100vw" imgClass="aspect-[16/9]" onOpen={onOpen} />
          <Cell item={items[1]} sizes="100vw" imgClass="aspect-[16/9]" className="border-t-[1.5px] border-[#1A1A18]" onOpen={onOpen} />
        </div>
      );

    case "single":
    default:
      return (
        <div className={outer}>
          <Cell item={items[0]} sizes="100vw" imgClass="aspect-[16/9]" onOpen={onOpen} />
        </div>
      );
  }
}

/* ─── Mockup rows ───────────────────────────────────────────────────────────── */

function MockupRows({ rows, onOpen }: { rows: MockupRow[]; onOpen: (src: string) => void }) {
  if (rows.length === 0) return null;

  const colsClass: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" };

  return (
    <div className="px-[60px] flex flex-col gap-2 mt-16">
      {rows.map((row, i) => {
        const imgs = (row.images ?? []).filter((img) => img.url);
        if (imgs.length === 0) return null;
        const n = Math.min(imgs.length, 3) as 1 | 2 | 3;
        return (
          <div key={i} className={`grid ${colsClass[n]} gap-2`}>
            {imgs.map((img, j) => (
              <div key={j} className="relative overflow-hidden cursor-zoom-in" onClick={() => onOpen(img.url)}>
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
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-5 right-6 text-white/70 hover:text-white text-3xl leading-none font-light" onClick={onClose} aria-label="Close">×</button>
      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
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

  if (sections.length === 0 && mockupRows.length === 0) return null;

  return (
    <>
      <div className="py-12">
        {sections.length > 0 && (
          <div className="px-[120px]">
            {sections.map((section, i) => (
              <BentoSection key={i} section={section} isFirst={i === 0} onOpen={setLightboxSrc} />
            ))}
          </div>
        )}
        {mockupRows.length > 0 && (
          <MockupRows rows={mockupRows} onOpen={setLightboxSrc} />
        )}
      </div>
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </>
  );
}
