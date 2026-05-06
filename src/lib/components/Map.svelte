<script lang="ts">
  import { onMount } from "svelte";
  import { theme } from "$lib/styles/theme";
  import { appState } from "$lib/stores/app.svelte";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  let {
    lat,
    lng,
    edgeToEdge = false,
  }: { lat?: number; lng?: number; edgeToEdge?: boolean } = $props();

  let mapElement: HTMLElement;
  let map: any;
  let L_ref: any;

  let currentPosMarker: any;
  let userLocationMarker: any;
  let supermarketMarkers: any[] = [];
  let historyMarkers: any[] = [];

  let loading = $state(false);
  let hasError = $state(false);

  let showStores = $state(true);
  let showHistory = $state(true);

  // Reactively add/remove layers
  $effect(() => {
    if (map) {
      supermarketMarkers.forEach((m) => {
        if (showStores) m.addTo(map);
        else map.removeLayer(m);
      });
    }
  });

  $effect(() => {
    if (map) {
      historyMarkers.forEach((m) => {
        if (showHistory) m.addTo(map);
        else map.removeLayer(m);
      });
    }
  });

  onMount(async () => {
    // dynamically import leaflet since it needs window
    const L = (await import("leaflet")).default;
    L_ref = L;
    await import("leaflet/dist/leaflet.css");

    // Fix leaflet icons in vite
    const iconRetinaUrl = (
      await import("leaflet/dist/images/marker-icon-2x.png?url")
    ).default;
    const iconUrl = (await import("leaflet/dist/images/marker-icon.png?url"))
      .default;
    const shadowUrl = (
      await import("leaflet/dist/images/marker-shadow.png?url")
    ).default;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });

    const defaultCenter: [number, number] = [35.6895, 139.6917];

    if (lat !== undefined && lng !== undefined) {
      map = L.map(mapElement).setView([lat, lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add initial location marker
      const initialIcon = L.divIcon({
        html: `<div style="background-color: ${theme.colors.accent}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        className: "",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker([lat, lng], { icon: initialIcon })
        .addTo(map)
        .bindPopup(appState.t("map.atLocation"));

      drawHistoryMarkers(L);
    } else {
      map = L.map(mapElement).setView(defaultCenter, 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      drawHistoryMarkers(L);

      // Try to get user location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (!map) return;
            const currentLat = pos.coords.latitude;
            const currentLon = pos.coords.longitude;
            map.setView([currentLat, currentLon], 15);

            // Add user marker
            const userIcon = L.divIcon({
              html: `<div style="background-color: ${theme.colors.success}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
              className: "",
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });
            userLocationMarker = L.marker([currentLat, currentLon], {
              icon: userIcon,
            })
              .addTo(map)
              .bindPopup(appState.t("map.userLocation"));
          },
          (err) => {
            console.error("Error getting location", err);
          },
        );
      }
    }
  });

  function drawHistoryMarkers(L: any) {
    const historyRedIcon = L.divIcon({
      html: `<div style="background-color: ${theme.colors.brandPink}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    appState.histories.forEach((h) => {
      if (h.location && h.location.lat && h.location.lng) {
        const marker = L.marker([h.location.lat, h.location.lng], {
          icon: historyRedIcon,
        });

        // Create popup container
        const container = L.DomUtil.create("div", "popup-history");
        const title = appState.getHistoryTitle(h);
        const dateStr = new Date(h.timestamp).toLocaleString(
          appState.language === "ja" ? "ja-JP" : "en-US",
        );

        container.innerHTML = `
          <div style="margin-bottom: 10px; min-width: 180px;">
            <strong style="display: block; font-size: 14px; margin-bottom: 2px; color: ${appState.isDark ? "#ffffff" : "#323232"};">${title}</strong>
            <small style="color: ${appState.isDark ? "#d1d1d6" : "#595959"};">${dateStr}</small>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button class="jump-calc-btn" style="background: ${theme.colors.accent}; color: #ffffff; border: none; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; width: 100%;">${appState.t("map.jumpToCalculate")}</button>
            <button class="jump-history-btn" style="background: ${theme.colors.surface}; color: ${theme.colors.accent}; border: 1px solid ${theme.colors.accent}; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; width: 100%;">${appState.t("map.jumpToHistory")}</button>
          </div>
        `;

        // Attach listeners using L.DomEvent to avoid issues in popup
        L.DomEvent.on(
          container.querySelector(".jump-calc-btn"),
          "click",
          (e: Event) => {
            L.DomEvent.stopPropagation(e);
            appState.loadHistory(h);
            goto(`${base}/`);
          },
        );

        L.DomEvent.on(
          container.querySelector(".jump-history-btn"),
          "click",
          (e: Event) => {
            L.DomEvent.stopPropagation(e);
            goto(`${base}/history#${h.id}`);
          },
        );

        marker.bindPopup(container);

        if (showHistory) {
          marker.addTo(map);
        }
        historyMarkers.push(marker);
      }
    });
  }

  async function handleSearch() {
    if (!map || !L_ref) return;
    const center = map.getCenter();
    await fetchSupermarkets(L_ref, center.lat, center.lng);
  }

  function centerOnUser() {
    if (!map || !L_ref) return;

    const updateLocation = (lat: number, lng: number) => {
      if (!map) return;
      map.setView([lat, lng], 15);

      if (!userLocationMarker) {
        const userIcon = L_ref.divIcon({
          html: '<div style="background-color: #4CAF50; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>',
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        userLocationMarker = L_ref.marker([lat, lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(appState.t("map.userLocation"));
      } else {
        userLocationMarker.setLatLng([lat, lng]);
      }
    };

    // If we have a cached location from appState (which watches in background), use it immediately
    if (appState.currentLocation) {
      updateLocation(
        appState.currentLocation.lat,
        appState.currentLocation.lng,
      );
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateLocation(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.error("Error getting location", err);
          if (!appState.currentLocation) {
            alert(appState.t("map.locationFailed"));
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      alert(appState.t("map.locationUnsupported"));
    }
  }

  async function fetchSupermarkets(L: any, lat: number, lon: number) {
    loading = true;
    hasError = false;
    try {
      // Clear existing supermarket markers
      supermarketMarkers.forEach((m) => map.removeLayer(m));
      supermarketMarkers = [];

      const radius = 2000;
      const query = `
        [out:json];
        (
          node["shop"="supermarket"](around:${radius},${lat},${lon});
          way["shop"="supermarket"](around:${radius},${lat},${lon});
        );
        out center;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      if (!map) return;
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      const supermarketIcon = L.divIcon({
        html: `<div style="background-color: ${theme.colors.accent}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      data.elements.forEach((el: any) => {
        const elLat = el.lat || el.center?.lat;
        const elLon = el.lon || el.center?.lon;
        if (elLat && elLon) {
          const name = el.tags?.name || appState.t("map.supermarket");
          const brand = el.tags?.brand || "";
          const openingHours = el.tags?.opening_hours || "";

          let popupContent = `<strong>${name}</strong>`;
          if (brand) popupContent += `<br/><small>${brand}</small>`;
          if (openingHours)
            popupContent += `<br/><small style="color: #666;">${appState.t("map.openingHours")}: ${openingHours}</small>`;

          const marker = L.marker([elLat, elLon], {
            icon: supermarketIcon,
          }).bindPopup(popupContent);

          if (showStores) marker.addTo(map);
          supermarketMarkers.push(marker);
        }
      });
    } catch (e) {
      console.error("Failed to fetch supermarkets", e);
      hasError = true;
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    return () => {
      if (map) {
        map.remove();
        map = null;
      }
    };
  });
</script>

<div
  style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; padding: 0 4px;"
>
  <div style="display: flex; gap: 12px; align-items: center; justify-content: space-around; width: 100%; flex-wrap: wrap;">
    <label
      style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: {theme
        .colors.surface}; padding: 8px 16px; border-radius: {theme.borderRadius
        .md}px; border: 1px solid {theme.colors.border};"
    >
      <input
        type="checkbox"
        bind:checked={showStores}
        style="accent-color: {theme.colors.accent}; width: 18px; height: 18px;"
      />
      <span
        style="font-size: 14px; font-weight: 600; color: {theme.colors
          .textPrimary};">{appState.t("map.filterStores")}</span
      >
    </label>
    <label
      style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: {theme
        .colors.surface}; padding: 8px 16px; border-radius: {theme.borderRadius
        .md}px; border: 1px solid {theme.colors.border};"
    >
      <input
        type="checkbox"
        bind:checked={showHistory}
        style="accent-color: {theme.colors
          .brandOchre}; width: 18px; height: 18px;"
      />
      <span
        style="font-size: 14px; font-weight: 600; color: {theme.colors
          .textPrimary};">{appState.t("map.filterHistory")}</span
      >
    </label>
  </div>

  <div style="display: flex; gap: 12px; align-items: center; justify-content: space-around; width: 100%; flex-wrap: wrap;">
    <button
      onclick={centerOnUser}
      class="map-ctrl-btn secondary"
      style="background-color: {theme.colors.surface}; color: {theme.colors
        .accent}; border: 1px solid {theme.colors.accent}; border-radius: {theme
        .borderRadius.md}px;"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4 12H2" />
        <path d="M22 12h-2" />
      </svg>
      {appState.t("map.currentLocation")}
    </button>

    <button
      onclick={handleSearch}
      class="map-ctrl-btn primary"
      style="background-color: {theme.colors.accent}; color: {theme.colors
        .bg}; border: none;"
      disabled={loading}
    >
      {#if loading}
        <div
          class="spinner"
          style="width: 16px; height: 16px; border-width: 2px; border-top-color: white;"
        ></div>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
        >
      {/if}
      {appState.t("map.search")}
    </button>
  </div>
</div>

<div
  class="map-container"
  class:edge-to-edge={edgeToEdge}
  class:dark={appState.isDark}
  style="border: {edgeToEdge
    ? 'none'
    : `1px solid ${theme.colors.border}`}; background-color: {theme.colors
    .surface};"
>
  <div bind:this={mapElement} class="map-element"></div>

  {#if loading}
    <div
      class="loading-overlay"
      style="color: {theme.colors.textPrimary}; background: {theme.colors
        .surface};"
    >
      <div
        class="spinner"
        style="border-top-color: {theme.colors.accent};"
      ></div>
      <span>{appState.t("map.searching")}</span>
    </div>
  {/if}
  {#if hasError}
    <div
      class="error-overlay"
      style="color: {theme.colors.textPrimary}; background: {theme.colors
        .surface};"
    >
      <span>{appState.t("map.error")}</span>
    </div>
  {/if}
</div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }
  .map-container.dark .map-element {
    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
  }
  .map-container.edge-to-edge {
    border-radius: 0;
  }
  .map-element {
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .map-ctrl-btn {
    padding: 10px 16px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .map-ctrl-btn.secondary:hover {
    background-color: var(--surface-card) !important;
  }
  .map-ctrl-btn.primary:hover:not(:disabled) {
    filter: brightness(1.1);
  }
  .map-ctrl-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .loading-overlay,
  .error-overlay {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    z-index: 1000;
    white-space: nowrap;
  }
  .spinner {
    width: 18px;
    height: 18px;
    border: 3px solid #eee;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Fix leaflet popup z-index issues if any */
  :global(.leaflet-popup) {
    z-index: 1000 !important;
  }
</style>
