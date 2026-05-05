<script lang="ts">
  import { page } from "$app/stores";
  import Container from "$lib/components/ui/Container.svelte";
  import Map from "$lib/components/Map.svelte";
  import { appState } from "$lib/stores/app.svelte";

  let initialLat = $derived($page.url.searchParams.get("lat"));
  let initialLng = $derived($page.url.searchParams.get("lng"));
</script>

<svelte:head>
  <title>{appState.t("nav.map")} - {appState.t("app.name")}</title>
</svelte:head>

<div style="width: 100%; height: calc(100dvh - 140px); min-height: 500px; display: flex; flex-direction: column; position: relative;">
  <Map lat={initialLat ? parseFloat(initialLat) : undefined} lng={initialLng ? parseFloat(initialLng) : undefined} edgeToEdge={true} />
</div>
