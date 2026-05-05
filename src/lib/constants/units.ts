export type UnitDef = {
  label: string;
  value: string;
  base: string;
  multiplier: number;
};

// Dictionary supporting i18n
export const UNITS: UnitDef[] = [
  // Weight
  { label: "units.g", value: "g", base: "g", multiplier: 1 },
  { label: "units.kg", value: "kg", base: "g", multiplier: 1000 },
  // Volume
  { label: "units.ml", value: "ml", base: "ml", multiplier: 1 },
  { label: "units.L", value: "L", base: "ml", multiplier: 1000 },
  // Counting
  { label: "units.pcs", value: "pcs", base: "pcs", multiplier: 1 },
  { label: "units.bottles", value: "bottles", base: "bottles", multiplier: 1 },
  { label: "units.packs", value: "packs", base: "packs", multiplier: 1 },
  { label: "units.times", value: "times", base: "times", multiplier: 1 },
  { label: "units.sheets", value: "sheets", base: "sheets", multiplier: 1 },
  { label: "units.pairs", value: "pairs", base: "pairs", multiplier: 1 },
  { label: "units.cans", value: "cans", base: "cans", multiplier: 1 },
  { label: "units.bags", value: "bags", base: "bags", multiplier: 1 },
  { label: "units.slices", value: "slices", base: "slices", multiplier: 1 },
  { label: "units.servings", value: "servings", base: "servings", multiplier: 1 },
  { label: "units.cases", value: "cases", base: "cases", multiplier: 1 },
  { label: "units.bundles", value: "bundles", base: "bundles", multiplier: 1 },
  { label: "units.sets", value: "sets", base: "sets", multiplier: 1 },
  { label: "units.grains", value: "grains", base: "grains", multiplier: 1 },
];
