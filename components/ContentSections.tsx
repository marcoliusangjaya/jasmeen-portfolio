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

type ContentSection = {
  layout: ContentLayout;
  images?: string[];
};

const B = "border-[1.5px] border-[#1A1A18]";

function ImgCell({
  src,
  alt = "",
  sizes,
  className = "",
  onOpen,
}: {
  src?: string;
  alt?: string;
  sizes: string;
  className?: string;
  onOpen?: (src: string) => void;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-border/10 ${className} ${src && onOpen ? "cursor-zoom-in" : ""}`}
      onClick={() => src && onOpen?.(src)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[70%] h-[70%]">
          {src && (
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes={sizes}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ContentSectionBlock({
  section,
  isFirst,
  onOpen,
}: {
  section: ContentSection;
  isFirst: boolean;
  onOpen: (src: string) => void;
}) {
  const imgs = section.images ?? [];
  const outer = `${B}${isFirst ? "" : " border-t-0"}`;
  const cell = (src: string | undefined, cls: string, sizes: string) => (
    <ImgCell src={src} className={cls} sizes={sizes} onOpen={onOpen} />
  );

  switch (section.layout) {
    case "large-top-6":
      return (
        <div className={outer}>
          {cell(imgs[0], "aspect-[16/9]", "100vw")}
          <div className="grid grid-cols-2 border-t-[1.5px] border-[#1A1A18]">
            {cell(imgs[1], "aspect-square", "50vw")}
            <div className={`${B} border-t-0 border-r-0 border-b-0 grid grid-cols-2`}>
              {cell(imgs[2], "aspect-square", "25vw")}
              {cell(imgs[3], `aspect-square border-l-[1.5px] border-[#1A1A18]`, "25vw")}
              {cell(imgs[4], `aspect-square border-t-[1.5px] border-[#1A1A18]`, "25vw")}
              {cell(imgs[5], `aspect-square border-l-[1.5px] border-t-[1.5px] border-[#1A1A18]`, "25vw")}
            </div>
          </div>
        </div>
      );

    case "large-bottom-6":
      return (
        <div className={outer}>
          <div className="grid grid-cols-2 border-b-[1.5px] border-[#1A1A18]">
            <div className="grid grid-cols-2">
              {cell(imgs[0], "aspect-square", "25vw")}
              {cell(imgs[1], `aspect-square border-l-[1.5px] border-[#1A1A18]`, "25vw")}
              {cell(imgs[2], `aspect-square border-t-[1.5px] border-[#1A1A18]`, "25vw")}
              {cell(imgs[3], `aspect-square border-l-[1.5px] border-t-[1.5px] border-[#1A1A18]`, "25vw")}
            </div>
            {cell(imgs[4], `aspect-square border-l-[1.5px] border-[#1A1A18]`, "50vw")}
          </div>
          {cell(imgs[5], "aspect-[16/9]", "100vw")}
        </div>
      );

    case "large-top-4":
      return (
        <div className={outer}>
          {cell(imgs[0], "aspect-[16/9]", "100vw")}
          <div className="grid grid-cols-2 border-t-[1.5px] border-[#1A1A18]">
            {cell(imgs[1], "aspect-square", "50vw")}
            <div className="border-l-[1.5px] border-[#1A1A18]">
              {cell(imgs[2], "aspect-[2/1]", "50vw")}
              {cell(imgs[3], `aspect-[2/1] border-t-[1.5px] border-[#1A1A18]`, "50vw")}
            </div>
          </div>
        </div>
      );

    case "large-bottom-4":
      return (
        <div className={outer}>
          <div className="grid grid-cols-2 border-b-[1.5px] border-[#1A1A18]">
            <div>
              {cell(imgs[0], "aspect-[2/1]", "50vw")}
              {cell(imgs[1], `aspect-[2/1] border-t-[1.5px] border-[#1A1A18]`, "50vw")}
            </div>
            {cell(imgs[2], `aspect-square border-l-[1.5px] border-[#1A1A18]`, "50vw")}
          </div>
          {cell(imgs[3], "aspect-[16/9]", "100vw")}
        </div>
      );

    case "five-grid":
      return (
        <div className={outer}>
          <div className="grid grid-cols-2 border-b-[1.5px] border-[#1A1A18]">
            {cell(imgs[0], "aspect-[4/3]", "50vw")}
            {cell(imgs[1], `aspect-[4/3] border-l-[1.5px] border-[#1A1A18]`, "50vw")}
          </div>
          <div className="grid grid-cols-3">
            {cell(imgs[2], "aspect-square", "33vw")}
            {cell(imgs[3], `aspect-square border-l-[1.5px] border-[#1A1A18]`, "33vw")}
            {cell(imgs[4], `aspect-square border-l-[1.5px] border-[#1A1A18]`, "33vw")}
          </div>
        </div>
      );

    case "three-col":
      return (
        <div className={`grid grid-cols-3 ${outer}`}>
          {cell(imgs[0], "aspect-[3/4]", "33vw")}
          {cell(imgs[1], `aspect-[3/4] border-l-[1.5px] border-[#1A1A18]`, "33vw")}
          {cell(imgs[2], `aspect-[3/4] border-l-[1.5px] border-[#1A1A18]`, "33vw")}
        </div>
      );

    case "two-col":
      return (
        <div className={`grid grid-cols-2 ${outer}`}>
          {cell(imgs[0], "aspect-[4/3]", "50vw")}
          {cell(imgs[1], `aspect-[4/3] border-l-[1.5px] border-[#1A1A18]`, "50vw")}
        </div>
      );

    case "single":
      return (
        <div className={outer}>
          {cell(imgs[0], "aspect-[16/9]", "100vw")}
        </div>
      );

    default:
      return null;
  }
}

/* ─── Lightbox ─────────────────────────────────────────────────────────────── */

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
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

/* ─── Public export ─────────────────────────────────────────────────────────── */

export default function ContentSections({
  sections,
}: {
  sections: ContentSection[];
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      <div className="px-[120px] py-2 mb-4">
        {sections.map((section, i) => (
          <ContentSectionBlock
            key={i}
            section={section}
            isFirst={i === 0}
            onOpen={setLightboxSrc}
          />
        ))}
      </div>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
}
