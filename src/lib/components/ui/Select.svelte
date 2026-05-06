<script lang="ts">
  import Column from "./Column.svelte";
  import Text from "./Text.svelte";
  import { theme } from "$lib/styles/theme";

  let {
    value = $bindable(),
    options = [],
    label,
    width,
    onChange,
  }: {
    value?: string;
    options: { label: string; value: string }[];
    label?: string;
    width?: number | string;
    onChange?: (v: string) => void;
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

  <div
    style:position="relative"
    style:display="inline-block"
    style:width={toCssUnit(width) || "100%"}
    style:height="44px"
  >
    <select
      bind:value
      onchange={(e) => onChange?.(e.currentTarget.value)}
      onfocus={() => (isFocused = true)}
      onblur={() => (isFocused = false)}
      style:-webkit-appearance="none"
      style:appearance="none"
      style:background-color={theme.colors.bg}
      style:color={theme.colors.textPrimary}
      style:border={isFocused
        ? `1px solid ${theme.colors.accent}`
        : `1px solid ${theme.colors.border}`}
      style:border-radius={`${theme.borderRadius.sm}px`}

      style:padding="0 36px 0 16px"
      style:line-height="44px"
      style:outline="none"
      style:transition="all 0.2s ease"
      style:font-size={`${theme.typography.sizes.md}px`}
      style:font-family={theme.typography.fontFamily}
      style:width="100%"
      style:height="100%"
      style:cursor="pointer"
    >
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    <div
      style:position="absolute"
      style:right="14px"
      style:top="50%"
      style:transform="translateY(-50%)"
      style:pointer-events="none"
      style:color={theme.colors.textSecondary}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>
</Column>
