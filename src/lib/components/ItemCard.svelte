<script lang="ts">
  import Column from "./ui/Column.svelte";
  import Row from "./ui/Row.svelte";
  import Container from "./ui/Container.svelte";
  import Text from "./ui/Text.svelte";
  import TextField from "./ui/TextField.svelte";
  import Button from "./ui/Button.svelte";
  import Select from "./ui/Select.svelte";
  import { ShieldAlert, Check, Trash } from "lucide-svelte";
  import { theme } from "$lib/styles/theme";
  import type { Item } from "$lib/types/Item";
  import { UNITS } from "$lib/constants/units";
  import { appState } from "$lib/stores/app.svelte";

  let mode = $derived(appState.mode);

  let {
    item = $bindable(),
    stats,
    onRemove,
  }: {
    item: Item;
    stats?: { status: string; diffPercentage: string };
    onRemove: () => void;
  } = $props();

  const formatPrice = (p: number) => {
    return p < 1 ? p.toFixed(2) : p.toFixed(1);
  };

  let isCheapest = $derived(stats?.status === "cheapest");
  let isTricked = $derived(stats?.status === "trick");
  let isTie = $derived(stats?.status === "tie");

  let statusColor = $derived(
    isCheapest || isTie
      ? theme.colors.success
      : isTricked
        ? theme.colors.danger
        : theme.colors.border,
  );

  let statusText = $derived(
    isTie
      ? "引き分け (同じ単価)"
      : isCheapest
        ? "最安値 (BEST VALUE)"
        : isTricked
          ? `割高注意（容量トリック検知: +${stats?.diffPercentage}% 割高）`
          : " ",
  );

  let unitMultiplier = $derived(
    mode === "capacity"
      ? UNITS.find((u) => u.value === item.unit)?.multiplier || 1
      : 1,
  );
  let baseUnit = $derived(
    mode === "capacity"
      ? UNITS.find((u) => u.value === item.unit)?.base || item.unit
      : "個",
  );
  let isValid = $derived(
    mode === "capacity"
      ? parseFloat(item.price) > 0 && parseFloat(item.amount) > 0
      : parseFloat(item.price) > 0 && parseFloat(item.itemCount || "0") > 0,
  );
  let unitPrice = $derived(
    isValid
      ? mode === "capacity"
        ? parseFloat(item.price) / (parseFloat(item.amount) * unitMultiplier)
        : (parseFloat(item.price) *
            (1 - parseFloat(item.pointRate || "0") / 100)) /
          parseFloat(item.itemCount || "1")
      : 0,
  );

  import { untrack } from "svelte";

  let isEditing = $state(untrack(() => !isValid));
  let prevMode = $state(untrack(() => mode));

  $effect(() => {
    if (!isValid) {
      isEditing = true;
    } else if (mode !== prevMode) {
      isEditing = false;
    }
    prevMode = mode;
  });

  let wrapperRef: HTMLDivElement | null = $state(null);

  // Collapse to tile when user taps outside this card
  const onDocPointerDown = (e: PointerEvent) => {
    if (!isEditing) return;
    if (!isValid) return;
    if (wrapperRef && !wrapperRef.contains(e.target as Node)) {
      isEditing = false;
    }
  };

  const openEdit = () => {
    isEditing = true;
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      if (isValid) isEditing = false;
    }
  };
</script>

<svelte:document onpointerdown={onDocPointerDown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={wrapperRef}
  onkeydown={handleKeydown}
  style="position: relative; width: 100%; margin-top: 12px; box-sizing: border-box;"
>
  <!-- Legend Title -->
  <div
    style:position="absolute"
    style:top="-12px"
    style:left="16px"
    style:background-color={statusText !== " " ? statusColor : "transparent"}
    style:color={isCheapest || isTie
      ? theme.colors.bg
      : theme.colors.textPrimary}
    style:padding={statusText !== " " ? "4px 12px" : "0"}
    style:border-radius={`${theme.borderRadius.sm}px`}
    style:font-size={`${theme.typography.sizes.xs}px`}
    style:font-weight={theme.typography.weights.extrabold}
    style:display="flex"
    style:align-items="center"
    style:gap="4px"
    style:z-index="1"
    style:opacity={statusText !== " " ? 1 : 0}
    style:transition="opacity 0.2s ease"
  >
    {#if isCheapest || isTie}
      <Check size={14} color={theme.colors.bg} />
    {:else if isTricked}
      <ShieldAlert size={14} color={theme.colors.textPrimary} />
    {/if}
    {statusText}
  </div>

  {#if isEditing}
    <Container
      width="100%"
      padding={16}
      borderRadius={theme.borderRadius.md}
      color={theme.colors.surface}
      border={`2px solid ${statusColor}`}
    >
      <Column gap={theme.spacing.xxl} width="100%">
        <Row width="100%" gap={theme.spacing.xl} crossAxisAlignment="start">
          <Container width="65%">
            <TextField
              bind:value={item.name}
              label="商品名"
              placeholder="(任意)"
              width="100%"
              type="text"
            />
          </Container>
          <Container width="35%">
            <TextField
              bind:value={item.price}
              label="価格"
              placeholder="398"
              type="number"
            />
          </Container>
        </Row>

        <Row
          width="100%"
          mainAxisAlignment="spaceBetween"
          crossAxisAlignment="end"
        >
          {#if mode === "capacity"}
            <Container width="40%">
              <TextField
                bind:value={item.amount}
                label="容量"
                placeholder="500"
                type="number"
              />
            </Container>
            <Container width="40%">
              <Select bind:value={item.unit} label="単位" options={UNITS} />
            </Container>
          {:else}
            <Container width="40%">
              <TextField
                bind:value={item.pointRate}
                label="付与率(%)"
                placeholder="0"
                type="number"
              />
            </Container>
            <Container width="40%">
              <TextField
                bind:value={item.itemCount}
                label="商品数(個)"
                placeholder="1"
                type="number"
              />
            </Container>
          {/if}
          <Button onPress={onRemove} color="transparent">
            <Trash size={20} color={theme.colors.textTertiary} />
          </Button>
        </Row>

        <!-- Inline Result if valid -->
        {#if isValid}
          <Row
            width="100%"
            mainAxisAlignment="spaceBetween"
            crossAxisAlignment="center"
          >
            <Text
              fontSize={theme.typography.sizes.xs}
              color={theme.colors.textTertiary}
            >
              ※ 枠外タップで確定
            </Text>
            <Text
              fontSize={theme.typography.sizes.sm}
              color={theme.colors.textTertiary}
              fontFamily={theme.typography.fontMono}
            >
              単価: ¥{formatPrice(unitPrice)} / {baseUnit}
            </Text>
          </Row>
        {/if}
      </Column>
    </Container>
  {:else}
    <!-- Item Tile -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      role="button"
      tabindex="0"
      onclick={openEdit}
      style="cursor: pointer; width: 100%; outline: none;"
    >
      <Container
        width="100%"
        padding={16}
        borderRadius={theme.borderRadius.md}
        color={theme.colors.surface}
        border={`2px solid ${statusColor}`}
      >
        <Row
          width="100%"
          mainAxisAlignment="spaceBetween"
          crossAxisAlignment="center"
        >
          <Column gap={theme.spacing.md}>
            <Text
              fontSize={theme.typography.sizes.xl}
              fontWeight={theme.typography.weights.bold}
              color={theme.colors.textPrimary}
            >
              {item.name || "名称未設定"}
            </Text>
            <Row gap={theme.spacing.sm} crossAxisAlignment="center">
              <Text
                fontSize={theme.typography.sizes.md}
                color={theme.colors.textSecondary}
                fontFamily={theme.typography.fontMono}
              >
                {#if mode === "capacity"}
                  ¥{formatPrice(parseFloat(item.price))}
                  <span style="color: {theme.colors.textTertiary}">/</span>
                  {item.amount}{item.unit}
                {:else}
                  ¥{formatPrice(parseFloat(item.price))}
                  <span style="color: {theme.colors.textTertiary}">/</span>
                  {item.pointRate || 0}%還元・{item.itemCount || 1}個
                {/if}
              </Text>
            </Row>
          </Column>

          <Column crossAxisAlignment="end" gap={theme.spacing.xs}>
            <Row gap={2} crossAxisAlignment="center">
              <Text
                fontSize={theme.typography.sizes.sm}
                color={theme.colors.textSecondary}
              >
                ¥
              </Text>
              <Text
                fontSize={theme.typography.sizes.h3}
                fontWeight={theme.typography.weights.extrabold}
                color={statusColor !== theme.colors.border
                  ? statusColor
                  : theme.colors.textPrimary}
                fontFamily={theme.typography.fontMono}
              >
                {formatPrice(unitPrice)}
              </Text>
            </Row>
            <Text
              fontSize={theme.typography.sizes.xs}
              color={theme.colors.textTertiary}
            >
              / {baseUnit}
            </Text>
          </Column>
        </Row>
      </Container>
    </div>
  {/if}
</div>
