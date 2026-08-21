import Image from "next/image";

function isGif(src?: string) {
  return typeof src === "string" && src.toLowerCase().includes(".gif");
}

/**
 * Drop-in for next/image's `fill` pattern. GIFs bypass next/image's
 * optimizer entirely (plain <img>) since re-encoding through it strips
 * the animation — everything else still gets Next's normal optimization.
 */
export function SmartFillImage({
  src,
  alt,
  objectFit = "cover",
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  objectFit?: "cover" | "contain";
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  if (isGif(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full ${fitClass} ${className}`}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`${fitClass} ${className}`}
    />
  );
}

/**
 * Drop-in for next/image sized to its own natural aspect ratio
 * (width: 100%, height: auto). Same GIF bypass as SmartFillImage.
 */
export function SmartNaturalImage({
  src,
  alt,
  width,
  height,
  sizes,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
}) {
  if (isGif(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ width: "100%", height: "auto", display: "block" }}
      sizes={sizes}
    />
  );
}

export { isGif };
