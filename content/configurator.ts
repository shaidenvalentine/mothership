/**
 * Configurator options — the choices shown on /configure.
 *
 * This is a "configurator lite": colour + material selections for the
 * exterior and interior, each with a CSS swatch for instant feedback. When
 * real per-option renders exist (e.g. AI-generated stills of the same van in
 * each finish), drop them in `public/images/config/` and set `image` on the
 * option — the preview will use it automatically.
 *
 * No prices are shown by design — Mothership is price-on-request / secured
 * with a 50% deposit, so the configurator produces a build spec, not a quote.
 */

export interface ConfigOption {
  id: string;
  label: string;
  /** Short descriptor shown under the active selection. */
  note?: string;
  /** CSS colour (or gradient) for the selector swatch. */
  swatch: string;
  /** Optional preview image override (future real render of this finish). */
  image?: string;
}

export interface ConfigGroup {
  id: string;
  label: string;
  surface: "exterior" | "interior";
  options: ConfigOption[];
}

/** Default preview imagery per surface (used until per-option renders exist). */
export const previewImages: Record<"exterior" | "interior", { src: string; alt: string }> = {
  exterior: {
    src: "/images/exterior-front.jpg",
    alt: "Mothership exterior",
  },
  interior: {
    src: "/images/lounge-golden.jpg",
    alt: "Mothership 3D-printed interior",
  },
};

export const configGroups: ConfigGroup[] = [
  {
    id: "exterior-color",
    label: "Exterior finish",
    surface: "exterior",
    options: [
      { id: "stealth-black", label: "Stealth Black", note: "The signature blacked-out finish.", swatch: "#0b0b0c" },
      { id: "graphite", label: "Graphite", note: "Deep gunmetal grey.", swatch: "#3b3f45" },
      { id: "alpine-white", label: "Alpine White", note: "Clean, reflective, heat-smart.", swatch: "#eceae5" },
      { id: "desert-sand", label: "Desert Sand", note: "Warm matte taupe.", swatch: "#c2a682" },
    ],
  },
  {
    id: "interior-wood",
    label: "Interior wood",
    surface: "interior",
    options: [
      { id: "pale-oak", label: "Pale Oak", note: "Light, airy, Scandinavian.", swatch: "#c7a678" },
      { id: "american-walnut", label: "American Walnut", note: "Rich, dark, classic.", swatch: "#5a4231" },
      { id: "smoked-ash", label: "Smoked Ash", note: "Muted greige, modern.", swatch: "#6e6a64" },
    ],
  },
  {
    id: "interior-material",
    label: "Upholstery",
    surface: "interior",
    options: [
      { id: "bone-leather", label: "Bone Leather", note: "Soft, pale full-grain.", swatch: "#e6decf" },
      { id: "espresso-leather", label: "Espresso Leather", note: "Deep brown full-grain.", swatch: "#3a2a21" },
      { id: "slate-wool", label: "Slate Wool", note: "Textured cool-grey textile.", swatch: "#474c54" },
    ],
  },
];

export type Selections = Record<string, string>;

/** First option of every group — the default build. */
export function defaultSelections(): Selections {
  return Object.fromEntries(
    configGroups.map((g) => [g.id, g.options[0].id]),
  );
}

/** Resolve the chosen option object for a group. */
export function selectedOption(
  group: ConfigGroup,
  selections: Selections,
): ConfigOption {
  const id = selections[group.id];
  return group.options.find((o) => o.id === id) ?? group.options[0];
}

/** One-line, human-readable build spec, e.g. for the reservation message. */
export function buildSpecLines(selections: Selections): string[] {
  return configGroups.map(
    (g) => `${g.label}: ${selectedOption(g, selections).label}`,
  );
}
