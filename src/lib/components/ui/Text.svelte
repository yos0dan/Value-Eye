<script lang="ts">
  import type { Snippet } from "svelte";
  import { theme } from "$lib/styles/theme";

  let {
    text = "",
    children,
    color,
    fontSize,
    fontWeight,
    fontFamily = theme.typography.fontFamily,
    textAlign,
    lineHeight,
    letterSpacing,
    overflow, // 'ellipsis', 'clip', 'visible'
    maxLines,
    style = "",
  }: {
    text?: string;
    children?: Snippet;
    color?: string;
    fontSize?: number | string;
    fontWeight?: number | string;
    fontFamily?: string;
    textAlign?: "left" | "center" | "right" | "justify";
    lineHeight?: number | string;
    letterSpacing?: number | string;
    overflow?: "ellipsis" | "clip" | "visible";
    maxLines?: number;
    style?: string;
  } = $props();

  const toCssUnit = (val?: string | number) =>
    typeof val === "number" ? `${val}px` : val;

  let layoutStyles = $derived.by(() => {
    let s = "";
    if (maxLines) {
      s += `display: -webkit-box; -webkit-line-clamp: ${maxLines}; -webkit-box-orient: vertical; overflow: hidden;`;
    } else if (overflow === "ellipsis") {
      s += `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
    } else if (overflow === "clip") {
      s += `white-space: nowrap; overflow: hidden; text-overflow: clip;`;
    }
    return s;
  });
</script>

<span
  style:color
  style:font-size={toCssUnit(fontSize)}
  style:font-weight={fontWeight}
  style:font-family={fontFamily}
  style:text-align={textAlign}
  style:line-height={lineHeight}
  style:letter-spacing={toCssUnit(letterSpacing)}
  style="{layoutStyles} {style}"
>
  {#if text}
    {text}
  {:else if children}
    {@render children()}
  {/if}
</span>
