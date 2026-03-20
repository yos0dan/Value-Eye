<script lang="ts">
  import type { Snippet } from "svelte";
  import Container from "./Container.svelte";
  import Text from "./Text.svelte";
  import { theme } from "$lib/styles/theme";

  let {
    children,
    text,
    onPress,
    color = theme.colors.surfaceHover,
    textColor = theme.colors.textPrimary,
    padding = { horizontal: theme.spacing.xxl, vertical: 10 },
    disabled = false,
    width,
    height,
  }: {
    children?: Snippet;
    text?: string;
    onPress?: () => void;
    color?: string;
    textColor?: string;
    padding?: any;
    disabled?: boolean;
    width?: number | string;
    height?: number | string;
  } = $props();
  let isHovered = $state(false);
  let isActive = $state(false);

  let scale = $derived(isActive ? 0.97 : 1);
  let brightness = $derived(isActive ? 0.9 : isHovered && !disabled ? 1.1 : 1);
</script>

<button
  type="button"
  onclick={(e) => {
    e.preventDefault();
    if (!disabled) onPress?.();
  }}
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => {
    isHovered = false;
    isActive = false;
  }}
  onmousedown={() => (isActive = true)}
  onmouseup={() => (isActive = false)}
  {disabled}
  style:width={width
    ? typeof width === "number"
      ? `${width}px`
      : width
    : "auto"}
  style:height={height
    ? typeof height === "number"
      ? `${height}px`
      : height
    : "auto"}
  style:background="transparent"
  style:border="none"
  style:padding="0"
  style:display="inline-block"
  style:cursor={disabled ? "not-allowed" : "pointer"}
  style:opacity={disabled ? 0.5 : 1}
>
  <div
    style:transition="all 0.2s ease"
    style:transform={`scale(${scale})`}
    style:filter={`brightness(${brightness})`}
    style:width="100%"
  >
    <Container
      {color}
      borderRadius={theme.borderRadius.md}
      {padding}
      alignment="center"
      width="100%"
    >
      {#if text}
        <Text color={textColor} fontWeight={600} fontSize={15}>{text}</Text>
      {:else if children}
        {@render children()}
      {/if}
    </Container>
  </div>
</button>
