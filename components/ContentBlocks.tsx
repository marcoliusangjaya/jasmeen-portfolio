"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Section = {
  caption?: string;
  images?: string[];
};

/* ─── Auto layout based on image count ─────────────────────────────────────── */

function ImageGrid({
  images,
  onOpen,
}: {
  images: string[];
  onOpen: (src: string) => void;
}) {
  const n = images.length;
  if (n === 0) return null;

  const cell = (src: string, sizes: string, cls = "") => (
    <div
      key={src}
      className={`relative overflow-hidden cursor-zoom-in ${cls}`}
      onClick={() => onOpen(src)}
    >
      <Image src={src} alt="" fill className="object-cover" sizes={sizes} />
    </div>
  );

  if (n === 1) {
    return (
      <div className="relative w-full aspect-video cursor-zoom-in" onClick={() => onOpen(images[0])}>
        <Image src={images[0]} alt="" fill className="object-cover" sizes="100vw" />
      </div>
    );
  }

  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-[1px]">
        {images.map((src) => cell(src, "50vw", "aspect-[3/4]"))}
      </div>
    );
  }

  if (n === 3) {
    return (
      <div className="grid grid-cols-3 gap-[1px]">
        {images.map((src) => cell(src, "33vw", "aspect-[3/4]"))}
      </div>
    );
  }

  if (n === 4) {
    return (
      <div className="grid grid-cols-2 gap-[1px]">
        {images.map((src) => cell(src, "50vw", "aspect-square"))}
      </div>
    );
  }

  if (n === 5) {
    return (
      <div className="flex flex-col gap-[1px]">
        <div className="grid grid-cols-2 gap-[1px]">
          {images.slice(0, 2).map((src) => cell(src, "50vw", "aspect-[4/3]"))}
        </div>
        <div className="grid grid-cols-3 gap-[1px]">
          {images.slice(2).map((src) => cell(src, "33vw", "aspect-square"))}
        </div>
      </div>
    );
  }

  if (n === 6) {
    return (
      <div className="grid grid-cols-3 gap-[1px]">
        {images.map((src) => cell(src, "33vw", "aspect-square"))}
      </div>
    );
  }

  // 7+ — masonry with CSS columns
  return (
    <div className="columns-2 gap-[1px]">
      {images.map((src, i) => (
        <div
          key={i}
          className="break-inside-avoid mb-[1px] relative overflow-hidden cursor-zoom-in"
          onClick={() => onOpen(src)}
        >
          <Image
            src={src}
            alt=""
            width={1200}
            height={900}
            style={{ width: "100%", height: "auto" }}
            className="block"
            sizes="50vw"
          />
        </div>
      ))}
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
        <Image
          src={src}
          alt=""
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>
    </div>
  );
}

/* ─── Mockups section ───────────────────────────────────────────────────────── */

function MockupsSection({
  mockups,
  onOpen,
}: {
  mockups: string[];
  onOpen: (src: string) => void;
}) {
  if (mockups.length === 0) return null;
  return (
    <div className="mt-24 flex flex-col gap-2">
      {mockups.map((src, i) => (
        <div
          key={i}
          className="relative w-full cursor-zoom-in"
          onClick={() => onOpen(src)}
        >
          <Image
            src={src}
            alt=""
            width={1920}
            height={1080}
            style={{ width: "100%", height: "auto" }}
            className="block"
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Public export ─────────────────────────────────────────────────────────── */

export default function ContentBlocks({
  sections,
  mockups = [],
}: {
  sections: Section[];
  mockups?: string[];
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (sections.length === 0 && mockups.length === 0) return null;

  return (
    <>
      <div className="px-[120px] py-12 flex flex-col gap-20">
        {sections.map((section, i) => (
          <div key={i} className="flex flex-col gap-5">
            {section.caption && (
              <p className="font-satoshi text-xs tracking-widest uppercase text-[#1A1A18]/50">
                {section.caption}
              </p>
            )}
            <ImageGrid images={section.images ?? []} onOpen={setLightboxSrc} />
          </div>
        ))}

        {mockups.length > 0 && (
          <MockupsSection mockups={mockups} onOpen={setLightboxSrc} />
        )}
      </div>

      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
}
