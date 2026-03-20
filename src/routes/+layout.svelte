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
  import { ReceiptText, History, Map, Settings } from "lucide-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  import { appState } from "$lib/stores/app.svelte";

  let { children }: { children: Snippet } = $props();

  let activeTab = $derived(
    $page.url.pathname.includes("/history")
      ? "history"
      : $page.url.pathname.includes("/map")
        ? "map"
        : $page.url.pathname.includes("/settings")
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
    <Column
      gap={theme.spacing.sm}
      crossAxisAlignment="start"
      width="100%"
      style="max-width: 600px;"
    >
      <Text
        fontSize={theme.typography.sizes.h1}
        fontWeight={theme.typography.weights.extrabold}
        letterSpacing={-0.5}
        color={theme.colors.textPrimary}
      >
        バリュー眼
      </Text>
      <Text
        fontSize={theme.typography.sizes.md}
        color={theme.colors.textSecondary}
      >
        容量の錯覚を、見抜く。
      </Text>
    </Column>
  </Container>
{/snippet}

{#snippet bottomNavigationBar()}
  <Row
    width="100%"
    gap={0}
    height="60px"
    margin="0 0 25px 0"
    style="background-color: {theme.colors.bg};"
  >
    <Container width="25%" height="100%" alignment="center">
      <Button
        onPress={() => goto("/")}
        width="100%"
        height="100%"
        color="transparent"
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
    </Container>
    <Container width="25%" height="100%" alignment="center">
      <Button
        onPress={() => goto("/history")}
        width="100%"
        height="100%"
        color="transparent"
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
    </Container>
    <Container width="25%" height="100%" alignment="center">
      <Button
        onPress={() => goto("/map")}
        width="100%"
        height="100%"
        color="transparent"
      >
        <Column gap={4} mainAxisAlignment="center" crossAxisAlignment="center">
          <Map
            size={22}
            color={activeTab === "map"
              ? theme.colors.accent
              : theme.colors.textSecondary}
          />
        </Column>
      </Button>
    </Container>
    <Container width="25%" height="100%" alignment="center">
      <Button
        onPress={() => goto("/settings")}
        width="100%"
        height="100%"
        color="transparent"
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
    </Container>
  </Row>
{/snippet}

<div
  style:background-color={theme.colors.bg}
  style:color={theme.colors.textPrimary}
  style:font-family={theme.typography.fontFamily}
  style:line-height="1.5"
  style:min-width="375px"
  style:min-height="100vh"
  style:display="flex"
  style:flex-direction="column"
>
  <Scaffold {appBar} {bottomNavigationBar}>
    <Container
      padding={{ top: 10, horizontal: 20, bottom: 40 }}
      width="100%"
      alignment="topCenter"
    >
      <Column width="100%" style="max-width: 600px;" gap={theme.spacing.xxl}>
        {@render children()}
      </Column>
    </Container>
  </Scaffold>
</div>
