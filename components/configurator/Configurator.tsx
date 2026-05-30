"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  configGroups,
  defaultSelections,
  previewImages,
  selectedOption,
  type ConfigGroup,
  type Selections,
} from "@/content/configurator";
import { cn } from "@/lib/utils";

interface ConfiguratorProps {
  /** Fires whenever the build changes, with a human-readable spec. */
  onConfigChange?: (specLines: string[]) => void;
  /** Smooth-scrolls to this element id when "Add to reservation" is clicked. */
  reserveTargetId?: string;
}

export function Configurator({
  onConfigChange,
  reserveTargetId = "reserve",
}: ConfiguratorProps) {
  const [selections, setSelections] = useState<Selections>(defaultSelections);
  const [surface, setSurface] = useState<"exterior" | "interior">("exterior");

  const groupsForSurface = useMemo(
    () => configGroups.filter((g) => g.surface === surface),
    [surface],
  );

  // The active exterior colour drives a subtle tint over the preview photo so
  // selecting a finish *feels* live, even before real per-option renders exist.
  const exteriorGroup = configGroups.find((g) => g.id === "exterior-color")!;
  const exteriorColor = selectedOption(exteriorGroup, selections).swatch;

  // Prefer a per-option render if one is set on the selected exterior option.
  const exteriorOpt = selectedOption(exteriorGroup, selections);
  const preview =
    surface === "exterior" && exteriorOpt.image
      ? { src: exteriorOpt.image, alt: exteriorOpt.label }
      : previewImages[surface];

  useEffect(() => {
    onConfigChange?.(
      configGroups.map((g) => `${g.label}: ${selectedOption(g, selections).label}`),
    );
  }, [selections, onConfigChange]);

  function choose(groupId: string, optionId: string) {
    setSelections((prev) => ({ ...prev, [groupId]: optionId }));
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
      {/* Preview */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ms-graphite/70 bg-ms-obsidian">
          <Image
            src={preview.src}
            alt={preview.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
          {/* Representative colour wash for the exterior finish. */}
          {surface === "exterior" ? (
            <div
              aria-hidden
              className="absolute inset-0 mix-blend-soft-light opacity-40 transition-colors duration-500"
              style={{ backgroundColor: exteriorColor }}
            />
          ) : null}

          {/* Surface toggle */}
          <div className="absolute left-4 top-4 flex gap-1 rounded-full border border-ms-graphite/70 bg-ms-black/70 p-1 backdrop-blur-md">
            {(["exterior", "interior"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSurface(s)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-body-sm capitalize transition-colors",
                  surface === s
                    ? "bg-ms-bone text-ms-black"
                    : "text-ms-fog hover:text-ms-bone",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Selected material chips (interior) */}
          {surface === "interior" ? (
            <div className="absolute bottom-4 left-4 flex gap-2">
              {configGroups
                .filter((g) => g.surface === "interior")
                .map((g) => {
                  const opt = selectedOption(g, selections);
                  return (
                    <span
                      key={g.id}
                      className="flex items-center gap-2 rounded-full border border-ms-graphite/70 bg-ms-black/70 py-1.5 pl-1.5 pr-3 text-body-sm text-ms-bone backdrop-blur-md"
                    >
                      <span
                        className="inline-block size-5 rounded-full border border-ms-bone/20"
                        style={{ backgroundColor: opt.swatch }}
                      />
                      {opt.label}
                    </span>
                  );
                })}
            </div>
          ) : null}
        </div>
        <p className="mt-3 font-mono text-body-sm text-ms-ash">
          Preview is representative — final finishes shown at your discovery call.
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-10">
        {groupsForSurface.map((group) => (
          <OptionGroup
            key={group.id}
            group={group}
            selectedId={selections[group.id]}
            onChoose={(optionId) => choose(group.id, optionId)}
          />
        ))}

        {/* Build summary */}
        <div className="rounded-2xl border border-ms-graphite/60 bg-ms-obsidian p-6">
          <span className="ms-caption text-ms-ion">Your build</span>
          <dl className="mt-4 space-y-2">
            {configGroups.map((g) => (
              <div key={g.id} className="flex justify-between gap-4 text-body">
                <dt className="text-ms-ash">{g.label}</dt>
                <dd className="text-ms-bone">
                  {selectedOption(g, selections).label}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href={`#${reserveTargetId}`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ms-bone px-7 py-3 text-body text-ms-black transition-colors hover:bg-ms-paper"
          >
            Add to reservation &darr;
          </a>
        </div>
      </div>
    </div>
  );
}

function OptionGroup({
  group,
  selectedId,
  onChoose,
}: {
  group: ConfigGroup;
  selectedId: string;
  onChoose: (optionId: string) => void;
}) {
  const active = group.options.find((o) => o.id === selectedId) ?? group.options[0];
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="ms-caption">{group.label}</span>
        <span className="text-body-sm text-ms-bone">{active.label}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {group.options.map((opt) => {
          const isActive = opt.id === selectedId;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChoose(opt.id)}
              title={opt.label}
              aria-label={opt.label}
              aria-pressed={isActive}
              className={cn(
                "size-11 rounded-full border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ms-ion",
                isActive
                  ? "border-ms-bone ring-2 ring-ms-bone/30 ring-offset-2 ring-offset-ms-black"
                  : "border-ms-graphite/60 hover:border-ms-fog",
              )}
              style={{ backgroundColor: opt.swatch }}
            />
          );
        })}
      </div>
      {active.note ? (
        <p className="mt-3 text-body-sm text-ms-fog">{active.note}</p>
      ) : null}
    </div>
  );
}
