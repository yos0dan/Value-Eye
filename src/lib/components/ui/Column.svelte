<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    mainAxisAlignment = "start",
    crossAxisAlignment = "center",
    alignment,
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
    alignment?:
      | "topLeft"
      | "topCenter"
      | "topRight"
      | "centerLeft"
      | "center"
      | "centerRight"
      | "bottomLeft"
      | "bottomCenter"
      | "bottomRight";
    gap?: number | string;
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    margin?: string | number;
    style?: string;
  } = $props();

  const getFlexAlignment = () => {
    if (!alignment) return { main: mainAxisAlignment, cross: crossAxisAlignment };
    let main = "start";
    let cross = "center";

    switch (alignment) {
      case "topLeft":
        main = "start";
        cross = "start";
        break;
      case "topCenter":
        main = "start";
        cross = "center";
        break;
      case "topRight":
        main = "start";
        cross = "end";
        break;
      case "centerLeft":
        main = "center";
        cross = "start";
        break;
      case "center":
        main = "center";
        cross = "center";
        break;
      case "centerRight":
        main = "center";
        cross = "end";
        break;
      case "bottomLeft":
        main = "end";
        cross = "start";
        break;
      case "bottomCenter":
        main = "end";
        cross = "center";
        break;
      case "bottomRight":
        main = "end";
        cross = "end";
        break;
    }
    return { main, cross };
  };

  const finalAlign = $derived(getFlexAlignment());

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

  const justifyContent = $derived(getJustifyContent(finalAlign.main));
  const alignItems = $derived(getAlignItems(finalAlign.cross));

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
