import type { Item } from "./Item";

export type HistoryEntry = {
  id: string;
  timestamp: number;
  title: string;
  items: Item[];
};
