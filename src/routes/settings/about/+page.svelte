<script lang="ts">
  import Container from "$lib/components/ui/Container.svelte";
  import Column from "$lib/components/ui/Column.svelte";
  import Text from "$lib/components/ui/Text.svelte";
  import Row from "$lib/components/ui/Row.svelte";
  import { ChevronLeft } from "lucide-svelte";
  import { theme } from "$lib/styles/theme";
  import { appState } from "$lib/stores/app.svelte";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { fly } from "svelte/transition";
  import { expoOut } from "svelte/easing";

  let appIcon = $derived(appState.isDark ? `${base}/icon-192-dark.png` : `${base}/icon-192.png`);
</script>

<svelte:head>
  <title>{appState.t("settings.about.title")} - {appState.t("app.name")}</title>
</svelte:head>

<div in:fly={{ x: 30, duration: 600, easing: expoOut }} out:fly={{ x: 20, duration: 300 }} style="width: 100%; background-color: {theme.colors.bg}; position: relative; z-index: 1;">
  <button
    onclick={() => goto(`${base}/settings`)}
    style="background: none; border: none; padding: 0 0 16px 0; cursor: pointer; display: flex; align-items: center; gap: 8px;"
  >
    <ChevronLeft size={24} color={theme.colors.textPrimary} />
    <Text
      fontSize={theme.typography.sizes.md}
      fontWeight={theme.typography.weights.bold}
      color={theme.colors.textPrimary}
    >
      {appState.t("nav.settings")}
    </Text>
  </button>

  <Container
    width="100%"
    padding={24}
    borderRadius={theme.borderRadius.xl}
    color={theme.colors.surface}
  >
    <Column gap={theme.spacing.lg} alignment="center">
      <img src={appIcon} alt="App Icon" style="width: 80px; height: 80px; border-radius: 20px; margin-bottom: 8px;" />
      <Text
        fontSize={theme.typography.sizes.lg}
        fontWeight={theme.typography.weights.semibold}
        color={theme.colors.textPrimary}
      >
        {appState.t("settings.about.desc1")}
      </Text>
      <Text
        fontSize={theme.typography.sizes.sm}
        color={theme.colors.textSecondary}
        style="line-height:1.6; text-align: center;"
      >
        {appState.t("settings.about.desc2")}<br
        />
        {appState.t("settings.about.desc3")}
      </Text>
      
      <div style="width: 100%; border-top: 1px solid {theme.colors.border}; margin: 16px 0;"></div>
      
      <Column gap={8} alignment="center">
        <Text
          fontSize={theme.typography.sizes.xs}
          color={theme.colors.textTertiary}
        >
          {appState.t("settings.about.version")}
        </Text>
        <Text
          fontSize={theme.typography.sizes.xs}
          color={theme.colors.textTertiary}
        >
          &copy; 2026 Value-Eye. All rights reserved.
        </Text>
      </Column>
    </Column>
  </Container>
</div>
