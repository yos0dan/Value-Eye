<script lang="ts">
  import Row from "$lib/components/ui/Row.svelte";
  import Container from "$lib/components/ui/Container.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Text from "$lib/components/ui/Text.svelte";
  import Column from "$lib/components/ui/Column.svelte";
  import { Plus, RefreshCcw } from "lucide-svelte";
  import { theme } from "$lib/styles/theme";
  import ItemCard from "$lib/components/ItemCard.svelte";
  import { appState } from "$lib/stores/app.svelte";
  import { analyzeItems } from "$lib/utils/calculator";

  let analyzedData = $derived(analyzeItems(appState.items));
</script>

<svelte:head>
  <title>バリュー眼: 容量の錯覚を、見抜く。</title>
</svelte:head>

<Row width="100%" height="45px" gap={theme.spacing.lg}>
  <Container
    width="70%"
    borderRadius={theme.borderRadius.md}
    color={theme.colors.surface}
    border={`1px solid ${theme.colors.border}`}
    alignment="center"
  >
    <Button
      onPress={() => appState.addItem()}
      color="transparent"
      textColor={theme.colors.accent}
      width="100%"
      height="100%"
      padding={{ vertical: 8 }}
    >
      <Row gap={theme.spacing.sm} mainAxisAlignment="center">
        <Plus size={16} color={theme.colors.accent} />
        <Text
          color={theme.colors.accent}
          fontWeight={theme.typography.weights.semibold}
          fontSize={theme.typography.sizes.sm}>追加</Text
        >
      </Row>
    </Button>
  </Container>

  <Container
    width="30%"
    borderRadius={theme.borderRadius.md}
    color={theme.colors.surface}
    border={`1px solid ${theme.colors.border}`}
    alignment="center"
  >
    <Button
      onPress={() => appState.resetComparison()}
      color={theme.colors.dangerBg}
      textColor={theme.colors.danger}
      width="100%"
      height="100%"
      padding={{ vertical: 8 }}
    >
      <Row gap={theme.spacing.sm} mainAxisAlignment="center">
        <RefreshCcw size={16} color={theme.colors.danger} />
        <Text
          color={theme.colors.danger}
          fontWeight={theme.typography.weights.semibold}
          fontSize={theme.typography.sizes.sm}>リセット</Text
        >
      </Row>
    </Button>
  </Container>
</Row>

<!-- Input List -->
<Column width="100%" gap={theme.spacing.xxl}>
  {#each appState.items as item, i (item.id)}
    <ItemCard
      bind:item={appState.items[i]}
      stats={analyzedData?.statusMap?.get(item.id)}
      onRemove={() => appState.removeItem(item.id)}
    />
  {/each}
</Column>
