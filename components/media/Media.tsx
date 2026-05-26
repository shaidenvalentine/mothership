import Image from "next/image";

import { cn } from "@/lib/utils";

interface MediaProps {
  src: string;
  alt: string;
  /** Sizing/aspect classes for the framing container (e.g. "aspect-[4/3] w-full"). */
  className?: string;
  /** Load eagerly for above-the-fold media. */
  priority?: boolean;
  /** Responsive sizes hint for the optimizer. */
  sizes?: string;
  /** Tailwind object-position helper if a crop needs biasing. */
  imageClassName?: string;
}

/**
 * Optimized image frame (next/image `fill`) with the house border + crop.
 * Used wherever real photography/renders replace the Phase 1 placeholders.
 */
export function Media({
  src,
  alt,
  className,
  priority,
  sizes = "100vw",
  imageClassName,
}: MediaProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-ms-graphite/70 bg-ms-obsidian",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
