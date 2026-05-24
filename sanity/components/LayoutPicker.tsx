import React from "react";
import { set, unset } from "sanity";
import type { StringInputProps } from "sanity";

// Shared rect style
const rs = { fill: "#C8C3BD", stroke: "#1A1A18", strokeWidth: "1" } as const;

// ─── Hero layout previews (viewBox 60 × 40) ──────────────────────────────────

const HERO_OPTIONS = [
  {
    value: "classic",
    title: "Showcase",
    sub: "1 large left · 1 top right · 2 small bottom right",
    count: "4 images",
    preview: () => (
      <svg viewBox="0 0 60 40" width={70} height={47} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5}  y={0.5}  width={29} height={39} {...rs} />
        <rect x={30.5} y={0.5}  width={29} height={19} {...rs} />
        <rect x={30.5} y={20.5} width={14} height={19} {...rs} />
        <rect x={45.5} y={20.5} width={14} height={19} {...rs} />
      </svg>
    ),
  },
  {
    value: "four-grid",
    title: "Even Grid",
    sub: "2 × 2 equal grid",
    count: "4 images",
    preview: () => (
      <svg viewBox="0 0 60 40" width={70} height={47} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5}  y={0.5}  width={29} height={19} {...rs} />
        <rect x={30.5} y={0.5}  width={29} height={19} {...rs} />
        <rect x={0.5}  y={20.5} width={29} height={19} {...rs} />
        <rect x={30.5} y={20.5} width={29} height={19} {...rs} />
      </svg>
    ),
  },
  {
    value: "large-right",
    title: "Right Focus",
    sub: "1 medium top left · 1 medium bottom left · 1 large right",
    count: "3 images",
    preview: () => (
      <svg viewBox="0 0 60 40" width={70} height={47} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5}  y={0.5}  width={29} height={19} {...rs} />
        <rect x={0.5}  y={20.5} width={29} height={19} {...rs} />
        <rect x={30.5} y={0.5}  width={29} height={39} {...rs} />
      </svg>
    ),
  },
  {
    value: "large-left-two-right",
    title: "Left Focus",
    sub: "1 large left · 1 medium top right · 1 medium bottom right",
    count: "3 images",
    preview: () => (
      <svg viewBox="0 0 60 40" width={70} height={47} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5}  y={0.5}  width={29} height={39} {...rs} />
        <rect x={30.5} y={0.5}  width={29} height={19} {...rs} />
        <rect x={30.5} y={20.5} width={29} height={19} {...rs} />
      </svg>
    ),
  },
  {
    value: "two-col",
    title: "Side by Side",
    sub: "2 equal columns",
    count: "2 images",
    preview: () => (
      <svg viewBox="0 0 60 40" width={70} height={47} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5}  y={0.5} width={29} height={39} {...rs} />
        <rect x={30.5} y={0.5} width={29} height={39} {...rs} />
      </svg>
    ),
  },
  {
    value: "single",
    title: "Full Width",
    sub: "1 image spanning full width",
    count: "1 image",
    preview: () => (
      <svg viewBox="0 0 60 40" width={70} height={47} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5} y={0.5} width={59} height={39} {...rs} />
      </svg>
    ),
  },
];

// ─── Content section previews (viewBox 60 × 52) ──────────────────────────────

const CONTENT_OPTIONS = [
  {
    value: "three-large-top",
    title: "Large Top",
    sub: "1 large top · 2 medium bottom",
    count: "3 images",
    preview: () => (
      <svg viewBox="0 0 60 52" width={60} height={52} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5}  y={0.5}  width={59} height={28} {...rs} />
        <rect x={0.5}  y={29.5} width={29} height={22} {...rs} />
        <rect x={30.5} y={29.5} width={29} height={22} {...rs} />
      </svg>
    ),
  },
  {
    value: "three-large-bottom",
    title: "Large Bottom",
    sub: "2 medium top · 1 large bottom",
    count: "3 images",
    preview: () => (
      <svg viewBox="0 0 60 52" width={60} height={52} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5}  y={0.5}  width={29} height={22} {...rs} />
        <rect x={30.5} y={0.5}  width={29} height={22} {...rs} />
        <rect x={0.5}  y={23.5} width={59} height={28} {...rs} />
      </svg>
    ),
  },
  {
    value: "two-stacked",
    title: "Two Stacked",
    sub: "2 full-width rows",
    count: "2 images",
    preview: () => (
      <svg viewBox="0 0 60 52" width={60} height={52} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5} y={0.5}  width={59} height={25} {...rs} />
        <rect x={0.5} y={26.5} width={59} height={25} {...rs} />
      </svg>
    ),
  },
  {
    value: "single",
    title: "Full Width",
    sub: "1 image spanning full width",
    count: "1 image",
    preview: () => (
      <svg viewBox="0 0 60 52" width={60} height={52} xmlns="http://www.w3.org/2000/svg">
        <rect x={0.5} y={0.5} width={59} height={51} {...rs} />
      </svg>
    ),
  },
];

// ─── Picker tile ─────────────────────────────────────────────────────────────

type LayoutOption = (typeof HERO_OPTIONS)[0];

function LayoutTile({
  option,
  selected,
  onClick,
}: {
  option: LayoutOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `2px solid ${selected ? "#1A1A18" : "#D0CBC2"}`,
        borderRadius: 8,
        padding: "10px 8px 8px",
        cursor: "pointer",
        background: selected ? "#EEEAE4" : "#FAFAF8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        transition: "border-color 0.15s, background 0.15s",
        outline: "none",
      }}
    >
      <option.preview />
      <div
        style={{
          fontSize: 10,
          fontFamily: "sans-serif",
          fontWeight: selected ? 600 : 400,
          color: selected ? "#1A1A18" : "#555",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {option.title}
        <div style={{ fontSize: 9, color: "#999", marginTop: 2 }}>
          {option.count}
        </div>
      </div>
    </button>
  );
}

// ─── Picker factory ───────────────────────────────────────────────────────────

function createPicker(options: LayoutOption[], columns: number) {
  return function LayoutPicker(props: StringInputProps) {
    const { value, onChange } = props;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 10,
          padding: "4px 0 8px",
        }}
      >
        {options.map((option) => (
          <LayoutTile
            key={option.value}
            option={option}
            selected={value === option.value}
            onClick={() =>
              onChange(option.value ? set(option.value) : unset())
            }
          />
        ))}
      </div>
    );
  };
}

export const HeroLayoutPicker = createPicker(HERO_OPTIONS, 3);
export const ContentLayoutPicker = createPicker(CONTENT_OPTIONS, 2);
