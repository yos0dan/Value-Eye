<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    width,
    height,
    children,
  }: {
    width?: number | string;
    height?: number | string;
    children?: Snippet;
  } = $props();

  const toCssUnit = (val?: string | number) =>
    typeof val === "number" ? `${val}px` : val;
</script>

<div
  style:width={width !== undefined ? toCssUnit(width) : undefined}
  style:height={height !== undefined ? toCssUnit(height) : undefined}
  style:flex-shrink={0}
  style:display={children ? "block" : "inline-flex"}
>
  {#if children}{@render children()}{/if}
</div>
