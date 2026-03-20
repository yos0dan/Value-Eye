<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    mainAxisAlignment = "start",
    crossAxisAlignment = "center",
    gap = 0,
    width,
    height,
    padding,
    margin,
    style = "",
  }: {
    children: Snippet;
    mainAxisAlignment?:
      | "start"
      | "end"
      | "center"
      | "spaceBetween"
      | "spaceAround"
      | "spaceEvenly";
    crossAxisAlignment?: "start" | "end" | "center" | "stretch" | "baseline";
    gap?: number | string;
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    margin?: string | number;
    style?: string;
  } = $props();

  const getJustifyContent = (align: string) => {
    switch (align) {
      case "start":
        return "flex-start";
      case "end":
        return "flex-end";
      case "center":
        return "center";
      case "spaceBetween":
        return "space-between";
      case "spaceAround":
        return "space-around";
      case "spaceEvenly":
        return "space-evenly";
      default:
        return "flex-start";
    }
  };

  const getAlignItems = (align: string) => {
    switch (align) {
      case "start":
        return "flex-start";
      case "end":
        return "flex-end";
      case "center":
        return "center";
      case "stretch":
        return "stretch";
      case "baseline":
        return "baseline";
      default:
        return "center";
    }
  };

  const justifyContent = $derived(getJustifyContent(mainAxisAlignment));
  const alignItems = $derived(getAlignItems(crossAxisAlignment));

  const toCssUnit = (val?: string | number) =>
    typeof val === "number" ? `${val}px` : val;
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:justify-content={justifyContent}
  style:align-items={alignItems}
  style:gap={gap !== undefined ? toCssUnit(gap) : undefined}
  style:width={width !== undefined ? toCssUnit(width) : undefined}
  style:height={height !== undefined ? toCssUnit(height) : undefined}
  style:padding={toCssUnit(padding)}
  style:margin={toCssUnit(margin)}
  {style}
>
  {@render children()}
</div>
