<script lang="ts">
  import Column from "./Column.svelte";
  import Text from "./Text.svelte";
  import { theme } from "$lib/styles/theme";

  let {
    value = $bindable(),
    placeholder = "",
    type = "text",
    label,
    width,
    onChange,
  }: {
    value?: string | number;
    placeholder?: string;
    type?: string;
    label?: string;
    width?: number | string;
    onChange?: (v: string | number) => void;
  } = $props();

  const toCssUnit = (val?: string | number) =>
    typeof val === "number" ? `${val}px` : val;
  let isFocused = $state(false);
</script>

<Column gap={4} crossAxisAlignment="start" {width}>
  {#if label}
    <Text
      fontSize={theme.typography.sizes.xs}
      color={theme.colors.textSecondary}
      fontWeight={theme.typography.weights.semibold}
      letterSpacing={1.5}>{label.toUpperCase()}</Text
    >
  {/if}
  <input
    {type}
    bind:value
    {placeholder}
    oninput={(e) => onChange?.(e.currentTarget.value)}
    onfocus={() => (isFocused = true)}
    onblur={() => (isFocused = false)}
    style:width={toCssUnit(width) || "100%"}
    style:height="44px"
    style:background-color={theme.colors.bg}
    style:color={theme.colors.textPrimary}
    style:border={isFocused
      ? `1px solid ${theme.colors.accent}`
      : `1px solid ${theme.colors.border}`}
    style:border-radius={`${theme.borderRadius.sm}px`}

    style:padding="12px 16px"
    style:outline="none"
    style:transition="all 0.2s ease"
    style:font-size={`${theme.typography.sizes.md}px`}
    style:font-family={theme.typography.fontFamily}
  />
</Column>
