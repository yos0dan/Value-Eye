<script lang="ts">
  import Column from "$lib/components/ui/Column.svelte";
  import Row from "$lib/components/ui/Row.svelte";
  import Container from "$lib/components/ui/Container.svelte";
  import Text from "$lib/components/ui/Text.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { Trash, Clock } from "lucide-svelte";
  import { theme } from "$lib/styles/theme";
  import { appState } from "$lib/stores/app.svelte";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  function restore(history: any) {
    if (
      confirm("現在の入力内容は上書きされます。履歴を復元して比較しますか？")
    ) {
      appState.loadHistory(history);
      goto(`${base}/`);
    }
  }
</script>

<svelte:head>
  <title>履歴 - バリュー眼</title>
</svelte:head>

<Container
  padding={{ top: 0, horizontal: 0, bottom: 20 }}
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
      これまでに回避した無駄遣い (Total Saved)
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
<Column width="100%" gap={theme.spacing.xl}>
  {#if appState.histories.length === 0}
    <Container padding={{ vertical: 40 }} alignment="center">
      <Text color={theme.colors.textSecondary}>履歴がありません</Text>
    </Container>
  {/if}
  {#each appState.histories as history (history.id)}
    <Container
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
          <Text
            fontWeight={theme.typography.weights.bold}
            fontSize={theme.typography.sizes.md}
            style="flex: 1; word-break: break-all;"
          >
            {history.title}
          </Text>
          <Button
            onPress={() => appState.deleteHistory(history.id)}
            color="transparent"
            padding={4}
            width="auto"
          >
            <Trash size={18} color={theme.colors.danger} />
          </Button>
        </Row>
        <Row gap={theme.spacing.sm}>
          <Clock size={14} color={theme.colors.textSecondary} />
          <Text
            fontSize={theme.typography.sizes.xs}
            color={theme.colors.textSecondary}
          >
            {new Date(history.timestamp).toLocaleString("ja-JP")}
          </Text>
        </Row>
        <Row width="100%" mainAxisAlignment="end">
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
                >この比較を復元</Text
              >
            </Button>
          </Container>
        </Row>
      </Column>
    </Container>
  {/each}
</Column>
