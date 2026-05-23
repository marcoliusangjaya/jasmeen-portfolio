import { useState } from "react";
import { set } from "sanity";
import type { ObjectInputProps } from "sanity";
import { projectId, dataset } from "../env";

function thumb(ref?: string): string | undefined {
  if (!ref) return undefined;
  const m = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!m) return undefined;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${m[1]}-${m[2]}.${m[3]}?w=600&q=75`;
}

function Slot({
  n,
  src,
  style,
  isOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  n: number;
  src?: string;
  style: React.CSSProperties;
  isOver?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent) => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(e); }}
      onDragLeave={onDragLeave}
      onDrop={(e) => { e.preventDefault(); onDrop?.(e); }}
      style={{
        position: "relative",
        overflow: "hidden",
        background: isOver ? "#C8C3BD" : "#DDD8D3",
        border: isOver ? "2px dashed #1A1A18" : "1px solid #C8C3BD",
        boxSizing: "border-box",
        cursor: "grab",
        transition: "background 0.15s, border 0.15s",
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
        />
      ) : (
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: isOver ? "#666" : "#AAA",
            fontSize: 18, fontFamily: "system-ui, sans-serif", fontWeight: 700,
            userSelect: "none", pointerEvents: "none",
          }}
        >
          {n}
        </div>
      )}
    </div>
  );
}

function LayoutPreview({
  layout,
  images,
  onSwap,
}: {
  layout: string;
  images: unknown[];
  onSwap: (a: number, b: number) => void;
}) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const t = Array.from({ length: 6 }, (_, i) =>
    thumb((images[i] as any)?.asset?._ref)
  );

  function sp(i: number) {
    return {
      isOver: dragOver === i && dragFrom !== null && dragFrom !== i,
      onDragStart: () => setDragFrom(i),
      onDragEnd: () => { setDragFrom(null); setDragOver(null); },
      onDragOver: () => setDragOver(i),
      onDragLeave: () => setDragOver(null),
      onDrop: () => {
        if (dragFrom !== null && dragFrom !== i) onSwap(dragFrom, i);
        setDragFrom(null);
        setDragOver(null);
      },
    };
  }

  const G: React.CSSProperties = { display: "grid" };

  if (layout === "large-top-6") return (
    <div style={G}>
      <Slot n={1} src={t[0]} style={{ aspectRatio: "16/9" }} {...sp(0)} />
      <div style={{ ...G, gridTemplateColumns: "1fr 1fr" }}>
        <Slot n={2} src={t[1]} style={{ aspectRatio: "1/1" }} {...sp(1)} />
        <div style={{ ...G, gridTemplateColumns: "1fr 1fr" }}>
          <Slot n={3} src={t[2]} style={{ aspectRatio: "1/1" }} {...sp(2)} />
          <Slot n={4} src={t[3]} style={{ aspectRatio: "1/1" }} {...sp(3)} />
          <Slot n={5} src={t[4]} style={{ aspectRatio: "1/1" }} {...sp(4)} />
          <Slot n={6} src={t[5]} style={{ aspectRatio: "1/1" }} {...sp(5)} />
        </div>
      </div>
    </div>
  );

  if (layout === "large-bottom-6") return (
    <div style={G}>
      <div style={{ ...G, gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ ...G, gridTemplateColumns: "1fr 1fr" }}>
          <Slot n={1} src={t[0]} style={{ aspectRatio: "1/1" }} {...sp(0)} />
          <Slot n={2} src={t[1]} style={{ aspectRatio: "1/1" }} {...sp(1)} />
          <Slot n={3} src={t[2]} style={{ aspectRatio: "1/1" }} {...sp(2)} />
          <Slot n={4} src={t[3]} style={{ aspectRatio: "1/1" }} {...sp(3)} />
        </div>
        <Slot n={5} src={t[4]} style={{ aspectRatio: "1/1" }} {...sp(4)} />
      </div>
      <Slot n={6} src={t[5]} style={{ aspectRatio: "16/9" }} {...sp(5)} />
    </div>
  );

  if (layout === "large-top-4") return (
    <div style={G}>
      <Slot n={1} src={t[0]} style={{ aspectRatio: "16/9" }} {...sp(0)} />
      <div style={{ ...G, gridTemplateColumns: "1fr 1fr" }}>
        <Slot n={2} src={t[1]} style={{ aspectRatio: "1/1" }} {...sp(1)} />
        <div style={G}>
          <Slot n={3} src={t[2]} style={{ aspectRatio: "2/1" }} {...sp(2)} />
          <Slot n={4} src={t[3]} style={{ aspectRatio: "2/1" }} {...sp(3)} />
        </div>
      </div>
    </div>
  );

  if (layout === "large-bottom-4") return (
    <div style={G}>
      <div style={{ ...G, gridTemplateColumns: "1fr 1fr" }}>
        <div style={G}>
          <Slot n={1} src={t[0]} style={{ aspectRatio: "2/1" }} {...sp(0)} />
          <Slot n={2} src={t[1]} style={{ aspectRatio: "2/1" }} {...sp(1)} />
        </div>
        <Slot n={3} src={t[2]} style={{ aspectRatio: "1/1" }} {...sp(2)} />
      </div>
      <Slot n={4} src={t[3]} style={{ aspectRatio: "16/9" }} {...sp(3)} />
    </div>
  );

  if (layout === "five-grid") return (
    <div style={G}>
      <div style={{ ...G, gridTemplateColumns: "1fr 1fr" }}>
        <Slot n={1} src={t[0]} style={{ aspectRatio: "4/3" }} {...sp(0)} />
        <Slot n={2} src={t[1]} style={{ aspectRatio: "4/3" }} {...sp(1)} />
      </div>
      <div style={{ ...G, gridTemplateColumns: "1fr 1fr 1fr" }}>
        <Slot n={3} src={t[2]} style={{ aspectRatio: "1/1" }} {...sp(2)} />
        <Slot n={4} src={t[3]} style={{ aspectRatio: "1/1" }} {...sp(3)} />
        <Slot n={5} src={t[4]} style={{ aspectRatio: "1/1" }} {...sp(4)} />
      </div>
    </div>
  );

  if (layout === "three-col") return (
    <div style={{ ...G, gridTemplateColumns: "1fr 1fr 1fr" }}>
      <Slot n={1} src={t[0]} style={{ aspectRatio: "3/4" }} {...sp(0)} />
      <Slot n={2} src={t[1]} style={{ aspectRatio: "3/4" }} {...sp(1)} />
      <Slot n={3} src={t[2]} style={{ aspectRatio: "3/4" }} {...sp(2)} />
    </div>
  );

  if (layout === "two-col") return (
    <div style={{ ...G, gridTemplateColumns: "1fr 1fr" }}>
      <Slot n={1} src={t[0]} style={{ aspectRatio: "4/3" }} {...sp(0)} />
      <Slot n={2} src={t[1]} style={{ aspectRatio: "4/3" }} {...sp(1)} />
    </div>
  );

  if (layout === "single")
    return <Slot n={1} src={t[0]} style={{ aspectRatio: "16/9" }} {...sp(0)} />;

  return null;
}

export function ContentSectionInput(props: ObjectInputProps) {
  const value = props.value as Record<string, unknown> | undefined;
  const layout = value?.layout as string | undefined;
  const images = (value?.images as unknown[]) ?? [];

  function handleSwap(a: number, b: number) {
    const next = [...images] as any[];
    [next[a], next[b]] = [next[b], next[a]];
    props.onChange(set(next, ["images"]));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {props.renderDefault(props)}

      {layout && (
        <div style={{ border: "1px solid #D0CBC2", borderRadius: 6, overflow: "hidden", background: "#F5F2EE" }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #D0CBC2", fontSize: 11, fontFamily: "system-ui, sans-serif", color: "#888" }}>
            Preview — drag slots to swap image positions
          </div>
          <div style={{ padding: 12 }}>
            <LayoutPreview layout={layout} images={images} onSwap={handleSwap} />
          </div>
        </div>
      )}
    </div>
  );
}
