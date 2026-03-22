<script lang="ts">
  import Container from "$lib/components/ui/Container.svelte";
  import Column from "$lib/components/ui/Column.svelte";
  import Text from "$lib/components/ui/Text.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Row from "$lib/components/ui/Row.svelte";
  import { Download } from "lucide-svelte";
  import { theme } from "$lib/styles/theme";
  import { appState } from "$lib/stores/app.svelte";

  function exportHistory() {
    if (appState.histories.length === 0) {
      alert("エクスポートする履歴がありません。");
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
  <title>Settings - バリュー眼</title>
</svelte:head>

<Column gap={theme.spacing.xxl} width="100%">
  <!-- Readme Section -->
  <Column gap={theme.spacing.sm} width="100%">
    <Text
      fontSize={theme.typography.sizes.lg}
      fontWeight={theme.typography.weights.bold}
    >
      バリュー眼 について
    </Text>
    <Container
      width="100%"
      padding={20}
      borderRadius={theme.borderRadius.md}
      color={theme.colors.surface}
      border={`1px solid ${theme.colors.border}`}
    >
      <Column gap={theme.spacing.lg}>
        <Text
          fontSize={theme.typography.sizes.md}
          fontWeight={theme.typography.weights.bold}
        >
          容量の錯覚を見抜く、究極の比較ツール。
        </Text>
        <Text
          fontSize={theme.typography.sizes.sm}
          color={theme.colors.textSecondary}
          style="line-height:1.6"
        >
          「大容量=お得」という無意識の固定観念や、悪意あるパッケージング。<br
          /><br />
          バリュー眼（Value-Eye）は、消費者が直感的に「本当に安くてお得なもの」を即座に計算し、賢い買い物を実現するためのシンプルなツールです。
        </Text>
        <Text
          fontSize={theme.typography.sizes.xs}
          color={theme.colors.textSecondary}
        >
          Version 1.0.0 (MVP)
        </Text>
      </Column>
    </Container>
  </Column>

  <!-- Theme Setting Section -->
  <Column gap={theme.spacing.sm} width="100%">
    <Text
      fontSize={theme.typography.sizes.lg}
      fontWeight={theme.typography.weights.bold}
    >
      表示テーマ
    </Text>
    <Container
      width="100%"
      padding={16}
      borderRadius={theme.borderRadius.md}
      color={theme.colors.surface}
      border={`1px solid ${theme.colors.border}`}
    >
      <div style="display: flex; background: {theme.colors.bg}; border-radius: {theme.borderRadius.md}px; padding: 4px; border: 1px solid {theme.colors.border};">
        {#each ['system', 'light', 'dark'] as t}
          <button
            onclick={() => appState.setThemePreference(t as 'system'|'light'|'dark')}
            style="flex: 1; padding: 10px; border-radius: {theme.borderRadius.sm}px; border: none; background: {appState.themePreference === t ? theme.colors.accent : 'transparent'}; color: {appState.themePreference === t ? '#fff' : theme.colors.textSecondary}; font-size: {theme.typography.sizes.sm}px; font-weight: {theme.typography.weights.bold}; cursor: pointer; transition: all 0.2s;"
          >
            {t === 'system' ? '自動設定 (System)' : t === 'light' ? 'ライト (Light)' : 'ダーク (Dark)'}
          </button>
        {/each}
      </div>
    </Container>
  </Column>

  <!-- Export Section -->
  <Column gap={theme.spacing.sm} width="100%">
    <Text
      fontSize={theme.typography.sizes.lg}
      fontWeight={theme.typography.weights.bold}
    >
      データ管理
    </Text>
    <Container
      width="100%"
      padding={16}
      borderRadius={theme.borderRadius.md}
      color={theme.colors.surface}
      border={`1px solid ${theme.colors.border}`}
    >
      <Row
        width="100%"
        mainAxisAlignment="spaceBetween"
        crossAxisAlignment="center"
      >
        <Column gap={4} style="flex: 1; padding-right: 16px;">
          <Text fontWeight={theme.typography.weights.semibold}
            >履歴のエクスポート</Text
          >
          <Text
            fontSize={theme.typography.sizes.xs}
            color={theme.colors.textSecondary}
            style="line-height: 1.4;"
            >保存された計算履歴を全てJSON形式でダウンロードします。</Text
          >
        </Column>
        <Button
          onPress={exportHistory}
          color={theme.colors.accent}
          width="auto"
          padding={{ horizontal: 16, vertical: 8 }}
          borderRadius={theme.borderRadius.sm}
        >
          <Row gap={8} mainAxisAlignment="center" crossAxisAlignment="center">
            <Download size={14} color={theme.colors.bg} />
            <Text
              color={theme.colors.bg}
              fontSize={theme.typography.sizes.sm}
              fontWeight={theme.typography.weights.bold}>保存</Text
            >
          </Row>
        </Button>
      </Row>
    </Container>
  </Column>
</Column>
