import { UNITS } from "$lib/constants/units";
import type { Item } from "$lib/types/Item";

export function analyzeItems(items: Item[]) {
  const validItems = items
    .filter((i) => {
      const p = parseFloat(i.price);
      const a = parseFloat(i.amount);
      return !isNaN(p) && !isNaN(a) && p > 0 && a > 0;
    })
    .map((item) => {
      const price = parseFloat(item.price);
      const amount = parseFloat(item.amount);

      const unitDef = UNITS.find((u) => u.value === item.unit);
      const multiplier = unitDef ? unitDef.multiplier : 1;
      const normalizedAmount = amount * multiplier;
      const baseUnit = unitDef ? unitDef.base : item.unit;

      const unitPrice = price / normalizedAmount;

      return {
        ...item,
        price,
        amount,
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
