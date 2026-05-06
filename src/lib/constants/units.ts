export type UnitDef = {
  label: string;
  value: string;
  base: string;
  multiplier: number;
};

// Dictionary supporting i18n
export const UNITS: UnitDef[] = [
  // Counting
  { label: "units.pcs", value: "pcs", base: "pcs", multiplier: 1 },
  // Weight
  { label: "units.g", value: "g", base: "g", multiplier: 1 },
  { label: "units.kg", value: "kg", base: "g", multiplier: 1000 },
  // Volume
  { label: "units.ml", value: "ml", base: "ml", multiplier: 1 },
  { label: "units.L", value: "L", base: "ml", multiplier: 1000 },

];
