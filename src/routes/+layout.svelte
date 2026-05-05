<script lang="ts">
  import "../app.css";
  import { theme } from "$lib/styles/theme";
  import type { Snippet } from "svelte";
  import Scaffold from "$lib/components/ui/Scaffold.svelte";
  import Container from "$lib/components/ui/Container.svelte";
  import Column from "$lib/components/ui/Column.svelte";
  import Text from "$lib/components/ui/Text.svelte";
  import Row from "$lib/components/ui/Row.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import {
    ReceiptText,
    History,
    Map as MapIcon,
    Settings,
    FlaskConical,
    CircleParking,
  } from "lucide-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  import { appState } from "$lib/stores/app.svelte";

  let { children }: { children: Snippet } = $props();

  let activeTab = $derived(
    $page.route.id?.includes("/history")
      ? "history"
      : $page.route.id === "/map"
        ? "map"
        : $page.route.id?.includes("/settings")
          ? "settings"
          : "compare",
  );

  let saveTimeout: any;
  $effect(() => {
    if (appState.isLoaded) {
      appState.save();

      const _trigger = JSON.stringify(appState.items);
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        appState.autoSaveHistory();
      }, 2000);
    }
  });
</script>

{#snippet appBar()}
  <Container
    padding={{ top: 40, horizontal: 20, bottom: 20 }}
    color={theme.colors.bg}
    width="100%"
    alignment="topCenter"
  >
    <Row
      width="100%"
      mainAxisAlignment="spaceBetween"
      crossAxisAlignment="center"
    >
      <Column gap={theme.spacing.sm} crossAxisAlignment="start">
        <Text
          fontSize={theme.typography.sizes.h1}
          fontWeight={theme.typography.weights.extrabold}
          letterSpacing={-0.5}
          color={theme.colors.textPrimary}
        >
          {appState.t("app.name")}
        </Text>
        <Text
          fontSize={theme.typography.sizes.md}
          color={theme.colors.textSecondary}
        >
          {appState.t("app.subtitle")}
        </Text>
      </Column>

      <div
        style="display: flex; background: {theme.colors
          .surface}; border-radius: {theme.borderRadius
          .full}px; padding: 4px; border: 1px solid {theme.colors.border};"
      >
        <button
          onclick={() => (appState.mode = "capacity")}
          style="padding: 6px 12px; border-radius: {theme.borderRadius
            .full}px; border: none; background: {appState.mode === 'capacity'
            ? theme.colors.accent
            : 'transparent'}; color: {appState.mode === 'capacity'
            ? '#ffffff'
            : theme.colors.textSecondary}; font-size: {theme.typography.sizes
            .sm}px; font-weight: {theme.typography.weights
            .bold}; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;"
        >
          <FlaskConical size={18} />
        </button>
        <button
          onclick={() => (appState.mode = "point")}
          style="padding: 6px 12px; border-radius: {theme.borderRadius
            .full}px; border: none; background: {appState.mode === 'point'
            ? theme.colors.accent
            : 'transparent'}; color: {appState.mode === 'point'
            ? '#ffffff'
            : theme.colors.textSecondary}; font-size: {theme.typography.sizes
            .sm}px; font-weight: {theme.typography.weights
            .bold}; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;"
        >
          <CircleParking size={18} />
        </button>
      </div>
    </Row>
  </Container>
{/snippet}

{#snippet bottomNavigationBar()}
  <nav class="responsive-nav" style="background-color: {theme.colors.bg};">
    <div class="nav-item">
      <Button
        onPress={() => goto(`${base}/`)}
        width="100%"
        height="100%"
        color="transparent"
        borderRadius={0}
      >
        <Column gap={4} mainAxisAlignment="center" crossAxisAlignment="center">
          <ReceiptText
            size={22}
            color={activeTab === "compare"
              ? theme.colors.accent
              : theme.colors.textSecondary}
          />
        </Column>
      </Button>
    </div>
    <div class="nav-item">
      <Button
        onPress={() => goto(`${base}/history`)}
        width="100%"
        height="100%"
        color="transparent"
        borderRadius={0}
      >
        <Column gap={4} mainAxisAlignment="center" crossAxisAlignment="center">
          <History
            size={22}
            color={activeTab === "history"
              ? theme.colors.accent
              : theme.colors.textSecondary}
          />
        </Column>
      </Button>
    </div>
    <div class="nav-item">
      <Button
        onPress={() => goto(`${base}/map`)}
        width="100%"
        height="100%"
        color="transparent"
        borderRadius={0}
      >
        <Column gap={4} mainAxisAlignment="center" crossAxisAlignment="center">
          <MapIcon
            size={22}
            color={activeTab === "map"
              ? theme.colors.accent
              : theme.colors.textSecondary}
          />
        </Column>
      </Button>
    </div>
    <div class="nav-item">
      <Button
        onPress={() => goto(`${base}/settings`)}
        width="100%"
        height="100%"
        color="transparent"
        borderRadius={0}
      >
        <Column gap={4} mainAxisAlignment="center" crossAxisAlignment="center">
          <Settings
            size={22}
            color={activeTab === "settings"
              ? theme.colors.accent
              : theme.colors.textSecondary}
          />
        </Column>
      </Button>
    </div>
  </nav>
{/snippet}

<div
  style:background-color={theme.colors.bg}
  style:color={theme.colors.textPrimary}
  style:font-family={theme.typography.fontFamily}
  style:line-height="1.5"
  style:min-width="350px"
  style:min-height="100vh"
  style:display="flex"
  style:flex-direction="column"
>
  <Scaffold {appBar} {bottomNavigationBar}>
    <Container
      padding={{
        top: 10,
        horizontal: activeTab === "map" ? 0 : 20,
        bottom: 40,
      }}
      width="100%"
      alignment="topCenter"
    >
      <Column
        width="100%"
        style="max-width: {activeTab === 'map' ? 'none' : '600px'};"
        gap={theme.spacing.md}
      >
        {@render children()}
      </Column>
    </Container>
  </Scaffold>
</div>

<style>
  .responsive-nav {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 60px;
    margin-bottom: 25px;
    align-items: center;
  }
  .nav-item {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  @media (min-width: 768px) {
    .responsive-nav {
      flex-direction: column;
      height: auto;
      margin-bottom: 0;
      padding-top: 40px;
      gap: 16px;
    }
    .nav-item {
      flex: none;
      height: 60px;
      width: 100%;
    }
  }
</style>
