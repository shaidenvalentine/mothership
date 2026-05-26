import { cn } from "@/lib/utils";

interface PlaceholderProps {
  /** Caption shown centered (e.g. "VIDEO LOOP", "3D VAN"). */
  label?: string;
  /** Optional accent color (CSS value) for a subtle tint + ring. */
  accent?: string;
  className?: string;
}

/**
 * Solid-color media placeholder used wherever real renders / video / images
 * will land in later phases. No sourced assets in Phase 1 — these mark the
 * aspect-ratio boxes and slots only.
 */
export function Placeholder({ label, accent, className }: PlaceholderProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl border border-ms-graphite/70 bg-ms-obsidian",
        className,
      )}
      style={
        accent
          ? {
              backgroundImage: `linear-gradient(135deg, color-mix(in oklch, ${accent} 22%, transparent), transparent 70%)`,
            }
          : undefined
      }
    >
      {/* hairline grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--color-ms-graphite) 60%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--color-ms-graphite) 60%, transparent) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {label ? <span className="ms-caption relative z-10">{label}</span> : null}
    </div>
  );
}
