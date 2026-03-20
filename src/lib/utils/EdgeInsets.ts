export type EdgeInsetsType = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  all?: number;
  vertical?: number;
  horizontal?: number;
};

export const EdgeInsets = {
  all: (val: number): EdgeInsetsType => ({ all: val }),
  symmetric: (
    horizontal: number = 0,
    vertical: number = 0,
  ): EdgeInsetsType => ({ horizontal, vertical }),
  only: (
    top: number = 0,
    bottom: number = 0,
    left: number = 0,
    right: number = 0,
  ): EdgeInsetsType => ({ top, bottom, left, right }),
};

export const parseEdgeInsets = (
  val?: number | string | EdgeInsetsType,
): string | undefined => {
  if (val === undefined) return undefined;
  if (typeof val === "number") return `${val}px`;
  if (typeof val === "string") return val;

  if (typeof val === "object") {
    if (val.all !== undefined) return `${val.all}px`;

    // Default to 0 if not provided
    const getVal = (v1?: number, v2?: number) => v1 ?? v2 ?? 0;

    const t = getVal(val.top, val.vertical);
    const r = getVal(val.right, val.horizontal);
    const b = getVal(val.bottom, val.vertical);
    const l = getVal(val.left, val.horizontal);

    return `${t}px ${r}px ${b}px ${l}px`;
  }
  return undefined;
};
