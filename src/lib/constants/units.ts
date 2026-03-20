export type UnitDef = {
  label: string;
  value: string;
  base: string;
  multiplier: number;
};

// Dictionary supporting i18n later if needed
export const UNITS: UnitDef[] = [
  { label: "g (グラム)", value: "g", base: "g", multiplier: 1 },
  { label: "kg (キログラム)", value: "kg", base: "g", multiplier: 1000 },
  { label: "ml (ミリリットル)", value: "ml", base: "ml", multiplier: 1 },
  { label: "L (リットル)", value: "L", base: "ml", multiplier: 1000 },
];
