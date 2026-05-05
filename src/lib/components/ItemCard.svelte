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
    isCheapest
      ? theme.colors.accent // Primary Blue
      : isTie
        ? theme.colors.brandLavender // Heading Blue
        : isTricked
          ? theme.colors.brandPink // Danger Red
          : theme.colors.surface
  );
  
  // Determine if the background is dark enough to require light text
  let isDarkBackground = $derived(isCheapest || isTricked);

  let finalTextColor = $derived.by(() => {
    if (isDarkBackground) return "#ffffff";
    if (appState.isDark) return "#ffffff";
    return theme.colors.textPrimary;
  });
  
  let secondaryTextColor = $derived.by(() => {
    if (isDarkBackground) return "rgba(255,255,255,0.85)";
    if (appState.isDark) return "rgba(255,255,255,0.7)";
    return theme.colors.textSecondary;
  });



  let statusText = $derived(
    isTie
      ? appState.t("compare.status.tie")
      : isCheapest
        ? appState.t("compare.status.best")
        : isTricked
          ? appState.t("compare.status.tricked", { diff: stats?.diffPercentage || "0" })
          : " ",
  );


  let unitMultiplier = $derived(
    mode === "capacity"
      ? UNITS.find((u) => u.value === item.unit)?.multiplier || 1
      : 1,
  );
  let baseUnit = $derived(
    mode === "capacity"
      ? appState.t(`units.${UNITS.find((u) => u.value === item.unit)?.base || item.unit}`)
      : appState.t("units.pcs"),
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
    style:background-color={statusText !== " " ? theme.colors.surface : "transparent"}
    style:color={theme.colors.textPrimary}
    style:padding={statusText !== " " ? "4px 12px" : "0"}
    style:border-radius={`${theme.borderRadius.full}px`}
    style:font-size={`${theme.typography.sizes.xs}px`}
    style:font-weight={theme.typography.weights.semibold}
    style:display="flex"
    style:align-items="center"
    style:gap="4px"
    style:z-index="1"
    style:opacity={statusText !== " " ? 1 : 0}
    style:transition="opacity 0.2s ease"
    style:box-shadow={statusText !== " " ? "0 2px 4px rgba(0,0,0,0.05)" : "none"}
  >
    {#if isCheapest || isTie}
      <Check size={14} color={theme.colors.success} />
    {:else if isTricked}
      <ShieldAlert size={14} color={theme.colors.warning} />
    {/if}
    {statusText}
  </div>

  {#if isEditing}
    <Container
      width="100%"
      padding={16}
      borderRadius={theme.borderRadius.lg}
      color={theme.colors.surface}
      border={`1px solid ${statusColor !== theme.colors.surface ? statusColor : theme.colors.border}`}
    >
      <Column gap={theme.spacing.xxl} width="100%">
        <Row width="100%" gap={theme.spacing.xl} crossAxisAlignment="start">
          <Container width="65%">
            <TextField
              bind:value={item.name}
              label={appState.t("compare.item.name")}
              placeholder={appState.t("compare.item.namePlaceholder")}
              width="100%"
              type="text"
            />
          </Container>
          <Container width="35%">
            <TextField
              bind:value={item.price}
              label={appState.t("compare.item.price")}
              placeholder={appState.t("compare.item.pricePlaceholder")}
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
                label={appState.t("compare.item.amount")}
                placeholder={appState.t("compare.item.amountPlaceholder")}
                type="number"
              />
            </Container>
            <Container width="40%">
              <Select 
                bind:value={item.unit} 
                label={appState.t("compare.item.unit")} 
                options={UNITS.map(u => ({ ...u, label: appState.t(u.label) }))} 
              />
            </Container>
          {:else}
            <Container width="40%">
              <TextField
                bind:value={item.pointRate}
                label={appState.t("compare.item.pointRate")}
                placeholder="0"
                type="number"
              />
            </Container>
            <Container width="40%">
              <TextField
                bind:value={item.itemCount}
                label={appState.t("compare.item.itemCount")}
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
              {appState.t("compare.item.editHint")}
            </Text>
            <Text
              fontSize={theme.typography.sizes.sm}
              color={theme.colors.textTertiary}
              fontFamily={theme.typography.fontMono}
            >
              {appState.t("compare.item.unitPrice")}: ¥{formatPrice(unitPrice)} / {baseUnit}
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
        padding={{ horizontal: 20, vertical: 24 }}
        borderRadius={theme.borderRadius.lg}
        color={statusColor}
        boxShadow={statusColor === theme.colors.surface ? theme.shadows.subtle : "none"}
      >
        <Row
          width="100%"
          mainAxisAlignment="spaceBetween"
          crossAxisAlignment="center"
        >
          <Column gap={theme.spacing.sm} crossAxisAlignment="start">
            <Text
              fontSize={theme.typography.sizes.lg}
              fontWeight={theme.typography.weights.bold}
              color={finalTextColor}
              style="line-height: 1.2"
            >
              {item.name || appState.t("compare.item.namePlaceholder")}
            </Text>
            <Row gap={theme.spacing.xs} crossAxisAlignment="center">
              <Text
                fontSize={theme.typography.sizes.sm}
                color={secondaryTextColor}
                fontFamily={theme.typography.fontMono}
              >
                {#if mode === "capacity"}
                  ¥{formatPrice(parseFloat(item.price))}
                  <span style="color: {secondaryTextColor}">/</span>
                  {item.amount}{appState.t(UNITS.find(u => u.value === item.unit)?.label || `units.${item.unit}`)}
                {:else}
                  ¥{formatPrice(parseFloat(item.price))}
                  <span style="color: {secondaryTextColor}">/</span>
                  {item.pointRate || 0}{appState.t("compare.item.pointBack")}{item.itemCount || 1}{appState.t("units.pcs")}
                {/if}
              </Text>
            </Row>
          </Column>

          <Column crossAxisAlignment="end" gap={theme.spacing.zero}>
            <Row gap={2} crossAxisAlignment="center">
              <Text
                fontSize={theme.typography.sizes.xs}
                color={secondaryTextColor}
              >
                ¥
              </Text>
              <Text
                fontSize={theme.typography.sizes.xl}
                fontWeight={theme.typography.weights.extrabold}
                color={finalTextColor}
                fontFamily={theme.typography.fontMono}
              >
                {formatPrice(unitPrice)}
              </Text>
            </Row>
            <Text
              fontSize={theme.typography.sizes.xs}
              color={secondaryTextColor}
            >
              / {baseUnit}
            </Text>
          </Column>
        </Row>
      </Container>
    </div>
  {/if}
</div>
