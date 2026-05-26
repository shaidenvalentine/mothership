/** A selectable exterior paint option. */
export interface ExteriorColor {
  id: string;
  name: string;
  /** Swatch color as an OKLCH/CSS value for the placeholder UI. */
  swatch: string;
  /** Upcharge in USD (0 if included). */
  price: number;
  /** Marks the default selection. */
  isDefault?: boolean;
  /** Custom options open an inquiry flow rather than a fixed price. */
  isCustom?: boolean;
}

/** A selectable interior material palette. */
export interface InteriorPalette {
  id: string;
  name: string;
  /** Materials description (verbatim from brief). */
  materials: string;
  /** Representative swatch color for the placeholder UI. */
  swatch: string;
  price: number;
  isDefault?: boolean;
}

/** A selectable wheel option. */
export interface Wheel {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
  /** Optional advisory note shown beside the option. */
  note?: string;
}

/** An optional add-on feature. */
export interface AddOn {
  id: string;
  name: string;
  price: number;
  /** Included by default with no upcharge. */
  isIncluded?: boolean;
}

/** Full configurator option set + base pricing. */
export interface ConfigOptions {
  basePrice: number;
  exteriorColors: ExteriorColor[];
  interiorPalettes: InteriorPalette[];
  wheels: Wheel[];
  addOns: AddOn[];
}
