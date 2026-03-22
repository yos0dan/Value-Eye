import type { Item } from "$lib/types/Item";
import type { HistoryEntry } from "$lib/types/History";
import { browser } from "$app/environment";
import { getItem, setItem } from "$lib/utils/db";
import { analyzeItems } from "$lib/utils/calculator";

export function generateId() {
  return crypto.randomUUID();
}

class AppState {
  items = $state<Item[]>([
    { id: generateId(), name: "", price: "", amount: "", unit: "g", pointRate: "", itemCount: "1" },
  ]);
  histories = $state<HistoryEntry[]>([]);
  isLoaded = $state(false);
  mode = $state<'capacity' | 'point'>('capacity');
  themePreference = $state<'system' | 'light' | 'dark'>('system');

  constructor() {
    if (browser) {
      this.load();
    }
  }

  async load() {
    try {
      const savedItems = await getItem<Item[]>("value-eye-items");
      if (savedItems && Array.isArray(savedItems) && savedItems.length > 0) {
        this.items = savedItems;
      }

      const savedHistories = await getItem<HistoryEntry[]>(
        "value-eye-histories",
      );
      if (savedHistories && Array.isArray(savedHistories)) {
        this.histories = savedHistories;
      }

      const savedTheme = localStorage.getItem("value-eye-theme") as 'system' | 'light' | 'dark' | null;
      if (savedTheme) {
        this.themePreference = savedTheme;
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
    this.isLoaded = true;
    this.applyTheme();
  }

  applyTheme() {
    if (!browser) return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (this.themePreference !== 'system') {
      root.classList.add(this.themePreference);
    }
  }

  setThemePreference(theme: 'system' | 'light' | 'dark') {
    this.themePreference = theme;
    if (browser) {
      localStorage.setItem("value-eye-theme", theme);
      this.applyTheme();
    }
  }

  async save() {
    if (!this.isLoaded || !browser) return;
    try {
      // Use $state.snapshot to avoid DataCloneError with IndexedDB when saving Svelte proxies
      await setItem("value-eye-items", $state.snapshot(this.items));
      await setItem("value-eye-histories", $state.snapshot(this.histories));
    } catch (e) {
      console.error("Failed to save state to IndexedDB", e);
    }
  }

  addItem() {
    const lastUnit = this.items[this.items.length - 1]?.unit ?? "g";
    this.items = [
      { id: generateId(), name: "", price: "", amount: "", unit: lastUnit, pointRate: "", itemCount: "1" },
      ...this.items,
    ];
    this.save();
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.save();
  }

  resetComparison() {
    this.items = [
      { id: generateId(), name: "", price: "", amount: "", unit: "g", pointRate: "", itemCount: "1" },
    ];
    this.save();
  }

  deleteHistory(id: string) {
    this.histories = this.histories.filter((h) => h.id !== id);
    this.save();
  }

  loadHistory(entry: HistoryEntry) {
    this.items = JSON.parse(JSON.stringify(entry.items));
    this.save();
  }

  autoSaveHistory() {
    const validItems = this.items.filter(
      (i) => parseFloat(i.price) > 0 && parseFloat(i.amount) > 0,
    );
    if (validItems.length < 2) return;

    // We must snapshot the proxy items for comparison
    const currentItemsStr = JSON.stringify($state.snapshot(this.items));
    const recent = this.histories[0];

    // Ignore if identical to the most recent history OR if this is the exact state we just loaded
    if (
      recent &&
      JSON.stringify($state.snapshot(recent.items)) === currentItemsStr
    ) {
      return;
    }

    const titleParts = validItems
      .map((i) => i.name || `${i.amount}${i.unit}の商品`)
      .slice(0, 3);
    const title =
      titleParts.join(" と ") +
      (validItems.length > 3 ? " などの比較" : "の比較");

    const newEntry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      title,
      items: JSON.parse(currentItemsStr),
    };

    this.histories = [newEntry, ...this.histories];
    this.save();
  }

  get totalSaved() {
    let total = 0;
    for (const h of this.histories) {
      if (!h.items || h.items.length < 2) continue;
      const analysis = analyzeItems(h.items, this.mode);
      if (analysis && analysis.savedAmount) {
        total += analysis.savedAmount;
      }
    }
    return Math.floor(total);
  }
}

export const appState = new AppState();
