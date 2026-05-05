import type { Item } from "$lib/types/Item";
import type { HistoryEntry } from "$lib/types/History";
import { browser } from "$app/environment";
import { getItem, setItem } from "$lib/utils/db";
import { analyzeItems } from "$lib/utils/calculator";
import { translations, type Language } from "$lib/i18n/translations";

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
  language = $state<Language>('ja');
  currentLocation = $state<{ lat: number; lng: number } | null>(null);
  private locationWatcher: number | null = null;

  isDark = $derived.by(() => {
    if (this.themePreference === 'dark') return true;
    if (this.themePreference === 'light') return false;
    if (browser) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  constructor() {
    if (browser) {
      this.load();
      this.startWatchingLocation();
    }
  }

  // Helper for translations
  t(path: string, params: Record<string, string | number> = {}) {
    const keys = path.split('.');
    let result: any = translations[this.language];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path; // Fallback to path if not found
      }
    }
    
    if (typeof result === 'string') {
      let str = result;
      for (const [key, value] of Object.entries(params)) {
        str = str.replace(`{${key}}`, String(value));
      }
      return str;
    }
    return path;
  }

  startWatchingLocation() {
    if (browser && "geolocation" in navigator) {
      this.locationWatcher = navigator.geolocation.watchPosition(
        (pos) => {
          this.currentLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
        },
        (err) => {
          console.warn("Failed to get location for history", err);
        },
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 }
      );
    }
  }

  async load() {
    try {
      const savedItems = await getItem<Item[]>("value-eye-items");
      if (savedItems && Array.isArray(savedItems) && savedItems.length > 0) {
        // Migration: convert old Japanese unit values to IDs
        this.items = savedItems.map(item => ({
          ...item,
          unit: item.unit === "個" ? "pcs" : item.unit
        }));
      }

      const savedHistories = await getItem<HistoryEntry[]>(
        "value-eye-histories",
      );
      if (savedHistories && Array.isArray(savedHistories)) {
        // Migration: convert old Japanese unit values in history
        this.histories = savedHistories.map(h => ({
          ...h,
          items: h.items.map(item => ({
            ...item,
            unit: item.unit === "個" ? "pcs" : item.unit
          }))
        }));
      }

      const savedTheme = localStorage.getItem("value-eye-theme") as 'system' | 'light' | 'dark' | null;
      if (savedTheme) {
        this.themePreference = savedTheme;
      }

      const savedLang = localStorage.getItem("value-eye-lang") as Language | null;
      if (savedLang && (savedLang === 'ja' || savedLang === 'en')) {
        this.language = savedLang;
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

  setLanguage(lang: Language) {
    this.language = lang;
    if (browser) {
      localStorage.setItem("value-eye-lang", lang);
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

  getHistoryTitle(entry: HistoryEntry) {
    const validItems = entry.items.filter(
      (i) => parseFloat(i.price) > 0 && (this.mode === 'capacity' ? parseFloat(i.amount) > 0 : parseFloat(i.itemCount || "0") > 0),
    );

    if (validItems.length === 0) return entry.title || "---";

    const titleParts = validItems
      .map((i) => i.name || this.t("history.historyItem", { 
        amount: this.mode === 'capacity' ? i.amount : (i.itemCount || "1"), 
        unit: this.t(`units.${this.mode === 'capacity' ? i.unit : "pcs"}`) 
      }))
      .slice(0, 3);
    
    const joinedItems = titleParts.join(this.t("history.separator"));
    return validItems.length > 3
      ? this.t("history.historyOfEtc", { items: joinedItems })
      : this.t("history.historyOf", { items: joinedItems });
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

    const newEntry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      title: "", // No longer storing static titles
      items: JSON.parse(currentItemsStr),
      ...(this.currentLocation ? { location: { ...this.currentLocation } } : {}),
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
