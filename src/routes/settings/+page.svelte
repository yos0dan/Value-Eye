<script lang="ts">
  import Container from "$lib/components/ui/Container.svelte";
  import Column from "$lib/components/ui/Column.svelte";
  import Text from "$lib/components/ui/Text.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Row from "$lib/components/ui/Row.svelte";
  import { Download, ChevronRight } from "lucide-svelte";
  import { theme } from "$lib/styles/theme";
  import { appState } from "$lib/stores/app.svelte";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { fade } from "svelte/transition";
  import { expoOut } from "svelte/easing";

  function exportHistory() {
    if (appState.histories.length === 0) {
      alert(appState.t("settings.export.noHistory"));
      return;
    }
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(appState.histories, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "value_eye_history.json");
    dlAnchorElem.style.display = "none";
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    document.body.removeChild(dlAnchorElem);
  }
</script>

<svelte:head>
  <title>{appState.t("nav.settings")} - {appState.t("app.name")}</title>
</svelte:head>

<div in:fade={{ duration: 400, easing: expoOut }} out:fade={{ duration: 300 }} style="width: 100%; background-color: {theme.colors.bg}; position: relative; z-index: 1; padding: 0 20px;">
  <Column gap={theme.spacing.lg} width="100%">
  <!-- Language Setting Section -->
  <Column gap={theme.spacing.sm} width="100%">
    <Text
      fontSize={theme.typography.sizes.xs}
      fontWeight={theme.typography.weights.semibold}
      letterSpacing={1.5}
      color={theme.colors.textSecondary}
    >
      {appState.t("settings.language.title").toUpperCase()}
    </Text>
    <Container
      width="100%"
      padding={20}
      borderRadius={theme.borderRadius.xl}
      color={theme.colors.brandPeach}
    >
      <div style="display: flex; background: rgba(255,255,255,0.3); border-radius: {theme.borderRadius.full}px; padding: 4px;">
        <button
          onclick={() => appState.setLanguage('ja')}
          style="flex: 1; padding: 12px; border-radius: {theme.borderRadius.full}px; border: none; background: {appState.language === 'ja' ? theme.colors.bg : 'transparent'}; color: {appState.language === 'ja' ? theme.colors.textPrimary : '#323232'}; font-size: {theme.typography.sizes.sm}px; font-weight: {theme.typography.weights.bold}; cursor: pointer; transition: all 0.2s;"
        >
          {appState.t("settings.language.ja")}
        </button>
        <button
          onclick={() => appState.setLanguage('en')}
          style="flex: 1; padding: 12px; border-radius: {theme.borderRadius.full}px; border: none; background: {appState.language === 'en' ? theme.colors.bg : 'transparent'}; color: {appState.language === 'en' ? theme.colors.textPrimary : '#323232'}; font-size: {theme.typography.sizes.sm}px; font-weight: {theme.typography.weights.bold}; cursor: pointer; transition: all 0.2s;"
        >
          {appState.t("settings.language.en")}
        </button>
      </div>
    </Container>
  </Column>

  <!-- Theme Setting Section -->
  <Column gap={theme.spacing.sm} width="100%">
    <Text
      fontSize={theme.typography.sizes.xs}
      fontWeight={theme.typography.weights.semibold}
      letterSpacing={1.5}
      color={theme.colors.textSecondary}
    >
      {appState.t("settings.theme.title").toUpperCase()}
    </Text>
    <Container
      width="100%"
      padding={20}
      borderRadius={theme.borderRadius.xl}
      color={theme.colors.brandLavender}
    >
      <div style="display: flex; background: rgba(255,255,255,0.3); border-radius: {theme.borderRadius.full}px; padding: 4px;">
        {#each ['system', 'light', 'dark'] as t}
          <button
            onclick={() => appState.setThemePreference(t as 'system'|'light'|'dark')}
            style="flex: 1; padding: 12px; border-radius: {theme.borderRadius.full}px; border: none; background: {appState.themePreference === t ? theme.colors.bg : 'transparent'}; color: {appState.themePreference === t ? theme.colors.textPrimary : '#323232'}; font-size: {theme.typography.sizes.xs}px; font-weight: {theme.typography.weights.bold}; cursor: pointer; transition: all 0.2s;"
          >
            {appState.t(`settings.theme.${t}`)}
          </button>
        {/each}
      </div>
    </Container>
  </Column>

  <!-- Export Section -->
  <Column gap={theme.spacing.sm} width="100%">
    <Text
      fontSize={theme.typography.sizes.xs}
      fontWeight={theme.typography.weights.semibold}
      letterSpacing={1.5}
      color={theme.colors.textSecondary}
    >
      {appState.t("settings.export.title").toUpperCase()}
    </Text>
    <Container
      width="100%"
      padding={20}
      borderRadius={theme.borderRadius.xl}
      color={theme.colors.brandPink}
    >
      <Row
        width="100%"
        mainAxisAlignment="spaceBetween"
        crossAxisAlignment="center"
      >
        <Column gap={4} style="flex: 1; padding-right: 16px;" crossAxisAlignment="start">
          <Text fontWeight={theme.typography.weights.semibold} color={theme.colors.bg}
            >{appState.t("settings.export.history")}</Text
          >
          <Text
            fontSize={theme.typography.sizes.xs}
            color="rgba(255,255,255,0.8)"
            style="line-height: 1.4;"
            >{appState.t("settings.export.historyDesc")}</Text
          >
        </Column>
        <Button
          onPress={exportHistory}
          color={theme.colors.bg}
          textColor={theme.colors.textPrimary}
          width="auto"
          padding={{ horizontal: 16, vertical: 8 }}
          height={40}
          borderRadius={theme.borderRadius.full}
        >
          <Row gap={8} mainAxisAlignment="center" crossAxisAlignment="center">
            <Download size={14} color={theme.colors.textPrimary} />
            <Text
              color={theme.colors.textPrimary}
              fontSize={theme.typography.sizes.sm}
              fontWeight={theme.typography.weights.bold}
              style="white-space: nowrap;">{appState.t("settings.export.save")}</Text
            >
          </Row>
        </Button>
      </Row>
    </Container>
  </Column>

  <!-- Readme Section (Nav Link) -->
  <Column gap={theme.spacing.sm} width="100%">
    <button 
      onclick={() => goto(`${base}/settings/about`)}
      style="background: none; border: none; padding: 12px 0; text-align: left; cursor: pointer; display: flex; align-items: center; justify-content: space-between; width: 100%; border-top: 1px solid {theme.colors.border}; margin-top: 16px;"
    >
      <Text
        fontSize={theme.typography.sizes.sm}
        fontWeight={theme.typography.weights.bold}
        color={theme.colors.textPrimary}
      >
        {appState.t("settings.about.title")}
      </Text>
      <ChevronRight size={20} color={theme.colors.textSecondary} />
    </button>
  </Column>
</Column>
</div>
