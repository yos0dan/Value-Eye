import { UNITS } from "$lib/constants/units";
import type { Item } from "$lib/types/Item";

export function analyzeItems(items: Item[], mode: 'capacity' | 'point' = 'capacity') {
  const validItems = items
    .filter((i) => {
      const p = parseFloat(i.price);
      if (isNaN(p) || p <= 0) return false;
      if (mode === 'capacity') {
        const a = parseFloat(i.amount);
        return !isNaN(a) && a > 0;
      } else {
        const c = parseFloat(i.itemCount || "1");
        return !isNaN(c) && c > 0;
      }
    })
    .map((item) => {
      const price = parseFloat(item.price);
      let unitPrice: number;
      let normalizedAmount: number;
      let baseUnit: string;

      if (mode === 'capacity') {
        const amount = parseFloat(item.amount);
        const unitDef = UNITS.find((u) => u.value === item.unit);
        const multiplier = unitDef ? unitDef.multiplier : 1;
        normalizedAmount = amount * multiplier;
        baseUnit = unitDef ? unitDef.base : item.unit;
        unitPrice = price / normalizedAmount;
      } else {
        const pointRate = parseFloat(item.pointRate || "0");
        const itemCount = parseFloat(item.itemCount || "1");
        normalizedAmount = itemCount;
        baseUnit = "個";
        const actualCost = price * (1 - pointRate / 100);
        unitPrice = actualCost / itemCount;
      }

      return {
        ...item,
        price,
        unitPrice,
        normalizedAmount,
        baseUnit,
      };
    });

  if (validItems.length < 2) return null;

  validItems.sort((a, b) => a.unitPrice - b.unitPrice);
  const cheapestItem = validItems[0];
  const mostExpensiveItem = validItems[validItems.length - 1];

  const itemsWithStats = validItems.map((item) => ({
    ...item,
    diffPercentage: (
      (item.unitPrice / cheapestItem.unitPrice) * 100 -
      100
    ).toFixed(1),
  }));

  const biggestItem = [...itemsWithStats].sort(
    (a, b) => b.normalizedAmount - a.normalizedAmount,
  )[0];

  const isTrickDetected =
    biggestItem &&
    biggestItem.id !== cheapestItem.id &&
    itemsWithStats.length >= 2;

  const statusMap = new Map();
  itemsWithStats.forEach((item) => {
    let status = "normal";
    const minPrice = cheapestItem.unitPrice;
    const isLowest = item.unitPrice === minPrice;
    const allLowest = itemsWithStats.every((i) => i.unitPrice === minPrice);

    if (allLowest && itemsWithStats.length >= 2) {
      status = "tie";
    } else if (isLowest) {
      status = "cheapest";
    } else if (isTrickDetected && item.id === biggestItem.id) {
      status = "trick";
    }

    statusMap.set(item.id, {
      status,
      diffPercentage: item.diffPercentage,
    });
  });

  // Calculate generic saved amount if they bought the cheapest instead of the most expensive
  const savedAmount = Math.max(
    0,
    (mostExpensiveItem.unitPrice - cheapestItem.unitPrice) *
      cheapestItem.normalizedAmount,
  );

  return {
    cheapestItem,
    mostExpensiveItem,
    isTrickDetected,
    statusMap,
    savedAmount,
  };
}
