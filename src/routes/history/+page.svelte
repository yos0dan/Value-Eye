<script lang="ts">
  import Column from "$lib/components/ui/Column.svelte";
  import Row from "$lib/components/ui/Row.svelte";
  import Container from "$lib/components/ui/Container.svelte";
  import Text from "$lib/components/ui/Text.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { Trash, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-svelte";
  import { theme } from "$lib/styles/theme";
  import { appState } from "$lib/stores/app.svelte";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { UNITS } from "$lib/constants/units";
  import { fade } from "svelte/transition";
  import { expoOut } from "svelte/easing";

  function restore(history: any) {
    if (
      confirm(appState.t("history.confirmRestore"))
    ) {
      appState.loadHistory(history);
      goto(`${base}/`);
    }
  }

  let expandedId = $state<string | null>(null);

  function toggleExpand(id: string) {
    expandedId = expandedId === id ? null : id;
  }

  function formatPrice(p: string | number) {
    const num = typeof p === 'string' ? parseFloat(p) : p;
    return num.toLocaleString();
  }
</script>

<svelte:head>
  <title>{appState.t("nav.history")} - {appState.t("app.name")}</title>
</svelte:head>

<div in:fade={{ duration: 400, easing: expoOut }} out:fade={{ duration: 300 }} style="width: 100%; background-color: {theme.colors.bg}; position: relative; z-index: 1; padding: 0 20px;">
<Container
  padding={{ top: 0, horizontal: 0, bottom: 8 }}
  width="100%"
  alignment="center"
>
  <Column
    gap={theme.spacing.xs}
    mainAxisAlignment="center"
    crossAxisAlignment="center"
  >
    <Text
      color={theme.colors.textSecondary}
      fontSize={theme.typography.sizes.sm}
    >
      {appState.t("history.totalSaved")}
    </Text>
    <Text
      color={theme.colors.success}
      fontSize={theme.typography.sizes.h1}
      fontWeight={theme.typography.weights.extrabold}
    >
      ¥{appState.totalSaved.toLocaleString()}
    </Text>
  </Column>
</Container>

<!-- History List -->
<Column width="100%" gap={theme.spacing.md}>
  {#if appState.histories.length === 0}
    <Container padding={{ vertical: 40 }} alignment="center">
      <Text color={theme.colors.textSecondary}>{appState.t("history.empty")}</Text>
    </Container>
  {/if}
  {#each appState.histories as history (history.id)}
    <Container
      id={history.id}
      width="100%"
      padding={16}
      borderRadius={theme.borderRadius.md}
      color={theme.colors.surface}
      border={`1px solid ${theme.colors.border}`}
    >
      <Column gap={theme.spacing.lg} width="100%" crossAxisAlignment="start">
        <Row
          width="100%"
          mainAxisAlignment="spaceBetween"
          crossAxisAlignment="start"
        >
          <button 
            onclick={() => toggleExpand(history.id)}
            style="flex: 1; background: none; border: none; padding: 0; text-align: left; cursor: pointer; display: flex; align-items: flex-start; gap: 8px;"
          >
            <div style="margin-top: 4px;">
              {#if expandedId === history.id}
                <ChevronUp size={18} color={theme.colors.textSecondary} />
              {:else}
                <ChevronDown size={18} color={theme.colors.textSecondary} />
              {/if}
            </div>
            <Text
              fontWeight={theme.typography.weights.bold}
              fontSize={theme.typography.sizes.md}
              color={theme.colors.textPrimary}
              style="flex: 1; word-break: break-all;"
            >
              {appState.getHistoryTitle(history)}
            </Text>
          </button>
          <Button
            onPress={() => appState.deleteHistory(history.id)}
            color="transparent"
            padding={4}
            width="auto"
          >
            <Trash size={18} color={theme.colors.danger} />
          </Button>
        </Row>

        {#if expandedId === history.id}
          <div style="width: 100%; border-top: 1px dashed {theme.colors.border}; padding-top: 12px; margin-top: -8px;">
            <Column gap={theme.spacing.sm} width="100%" crossAxisAlignment="start">
              {#each history.items as item}
                <Row width="100%" mainAxisAlignment="spaceBetween" style="padding: 4px 0;">
                  <Text fontSize={theme.typography.sizes.sm} color={theme.colors.textPrimary}>
                    {item.name || appState.t("compare.item.namePlaceholder")}
                  </Text>
                  <Text fontSize={theme.typography.sizes.sm} color={theme.colors.textSecondary} fontFamily={theme.typography.fontMono}>
                    ¥{formatPrice(item.price)} / {item.amount}{appState.t(UNITS.find(u => u.value === item.unit)?.label || `units.${item.unit}`)}
                  </Text>
                </Row>
              {/each}
            </Column>
          </div>
        {/if}

        <Row gap={theme.spacing.sm} width="100%" crossAxisAlignment="center">
          <Clock size={14} color={theme.colors.textSecondary} />
          <Text
            fontSize={theme.typography.sizes.xs}
            color={theme.colors.textSecondary}
          >
            {new Date(history.timestamp).toLocaleString(appState.language === "ja" ? "ja-JP" : "en-US")}
          </Text>
          {#if history.location}
            <Button
              onPress={() => goto(`${base}/map?lat=${history.location?.lat}&lng=${history.location?.lng}`)}
              color="transparent"
              padding={4}
              width="auto"
            >
              <MapPin size={16} color={theme.colors.accent} />
              <Text fontSize={theme.typography.sizes.xs} color={theme.colors.accent} style="margin-left: 4px; white-space: nowrap;">{appState.t("history.viewLocation")}</Text>
            </Button>
          {/if}
          <div style="flex: 1;"></div>
          <Container
            borderRadius={theme.borderRadius.sm}
            border={`1px solid ${theme.colors.border}`}
            color={theme.colors.bg}
          >
            <Button
              onPress={() => restore(history)}
              color="transparent"
              padding={{ horizontal: 16, vertical: 8 }}
              width="auto"
            >
              <Text
                color={theme.colors.textPrimary}
                fontSize={theme.typography.sizes.sm}
                fontWeight={theme.typography.weights.semibold}
                >{appState.t("history.restore")}</Text
              >
            </Button>
          </Container>
        </Row>
      </Column>
    </Container>
  {/each}
</Column>
</div>
