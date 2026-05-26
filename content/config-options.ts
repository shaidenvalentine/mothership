import type { ConfigOptions } from "@/types";

/**
 * Configurator option set and pricing (brief §"Configurator — /configure").
 * Swatch values are approximate OKLCH placeholders for the Phase 1 static UI;
 * real materials/textures arrive with the 3D model in Phase 4.
 */
export const configOptions: ConfigOptions = {
  basePrice: 295_000,

  exteriorColors: [
    {
      id: "stealth-black",
      name: "Stealth Black",
      swatch: "oklch(0.18 0 0)",
      price: 0,
      isDefault: true,
    },
    {
      id: "lunar-white",
      name: "Lunar White",
      swatch: "oklch(0.95 0.005 80)",
      price: 0,
    },
    {
      id: "graphite-metallic",
      name: "Graphite Metallic",
      swatch: "oklch(0.5 0.01 250)",
      price: 0,
    },
    {
      id: "dune",
      name: "Dune",
      swatch: "oklch(0.74 0.06 80)",
      price: 0,
    },
    {
      id: "custom",
      name: "Custom",
      swatch: "oklch(0.78 0.16 230)",
      price: 5_000,
      isCustom: true,
    },
  ],

  interiorPalettes: [
    {
      id: "obsidian",
      name: "Obsidian",
      materials: "black + dark teak + brushed steel",
      swatch: "oklch(0.13 0 0)",
      price: 0,
      isDefault: true,
    },
    {
      id: "bone",
      name: "Bone",
      materials: "warm cream + light teak + bronze",
      swatch: "oklch(0.92 0.02 80)",
      price: 0,
    },
    {
      id: "slate",
      name: "Slate",
      materials: "gray + walnut + matte black",
      swatch: "oklch(0.5 0.005 250)",
      price: 0,
    },
    {
      id: "ember",
      name: "Ember",
      materials: "deep brown + cognac leather + brass",
      swatch: "oklch(0.4 0.07 50)",
      price: 0,
    },
  ],

  wheels: [
    {
      id: "18-forged-at",
      name: '18" Forged AT',
      price: 0,
      isDefault: true,
    },
    {
      id: "17-black-rhino",
      name: '17" Black Rhino All-Terrain',
      price: 0,
    },
    {
      id: "20-forged-sport",
      name: '20" Forged Sport',
      price: 3_500,
      note: "Not recommended for off-road",
    },
  ],

  addOns: [
    { id: "rooftop-tent", name: "Rooftop tent", price: 8_500 },
    { id: "lithium-20kwh", name: "Lithium upgrade — 20 kWh", price: 12_000 },
    {
      id: "starlink-roam",
      name: "Starlink Roam pre-installed",
      price: 2_800,
    },
    { id: "bull-bar-winch", name: "Bull bar + winch", price: 5_500 },
    { id: "awning-led", name: "Awning with LED", price: 3_200 },
    { id: "offroad-lights", name: "Off-road light package", price: 2_400 },
    { id: "spa-shower-upgrade", name: "Spa shower upgrade", price: 4_200 },
    {
      id: "incinerating-toilet",
      name: "Incinerating toilet",
      price: 0,
      isIncluded: true,
    },
  ],
};
