<script lang="ts">
  import { page } from "$app/stores";
  import Container from "$lib/components/ui/Container.svelte";
  import Map from "$lib/components/Map.svelte";
  import { theme } from "$lib/styles/theme";
  import { appState } from "$lib/stores/app.svelte";
  import { fade } from "svelte/transition";
  import { expoOut } from "svelte/easing";

  let initialLat = $derived($page.url.searchParams.get("lat"));
  let initialLng = $derived($page.url.searchParams.get("lng"));
</script>

<svelte:head>
  <title>{appState.t("nav.map")} - {appState.t("app.name")}</title>
</svelte:head>

<div in:fade={{ duration: 400, easing: expoOut }} out:fade={{ duration: 300 }} style="width: 100%; background-color: {theme.colors.bg}; position: relative; z-index: 1;">
  <div style="width: 100%; height: calc(100dvh - 140px); min-height: 500px; display: flex; flex-direction: column; position: relative;">
    <Map lat={initialLat ? parseFloat(initialLat) : undefined} lng={initialLng ? parseFloat(initialLng) : undefined} edgeToEdge={true} />
  </div>
</div>
