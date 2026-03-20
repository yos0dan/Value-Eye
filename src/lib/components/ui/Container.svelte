<script lang="ts">
  import type { Snippet } from "svelte";
  import { parseEdgeInsets, type EdgeInsetsType } from "$lib/utils/EdgeInsets";

  let {
    children,
    width,
    height,
    padding,
    margin,
    color, // background color
    borderRadius,
    border,
    boxShadow,
    alignment, // like Flutter: 'center', 'topLeft', etc.
    position,
    top,
    bottom,
    left,
    right,
    zIndex,
    as = "div",
    style = "",
  }: {
    children?: Snippet;
    width?: number | string;
    height?: number | string;
    padding?: number | string | EdgeInsetsType;
    margin?: number | string | EdgeInsetsType;
    color?: string;
    borderRadius?: number | string;
    border?: string;
    boxShadow?: string;
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
    position?: "absolute" | "relative" | "fixed" | "sticky" | "static";
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    zIndex?: number;
    as?: string;
    style?: string;
  } = $props();

  const toCssUnit = (val?: string | number) =>
    typeof val === "number" ? `${val}px` : val;

  const getFlexAlignment = () => {
    if (!alignment) return {};
    const display = "flex";
    let justifyContent = "center";
    let alignItems = "center";

    switch (alignment) {
      case "topLeft":
        justifyContent = "flex-start";
        alignItems = "flex-start";
        break;
      case "topCenter":
        justifyContent = "center";
        alignItems = "flex-start";
        break;
      case "topRight":
        justifyContent = "flex-end";
        alignItems = "flex-start";
        break;
      case "centerLeft":
        justifyContent = "flex-start";
        alignItems = "center";
        break;
      case "center":
        justifyContent = "center";
        alignItems = "center";
        break;
      case "centerRight":
        justifyContent = "flex-end";
        alignItems = "center";
        break;
      case "bottomLeft":
        justifyContent = "flex-start";
        alignItems = "flex-end";
        break;
      case "bottomCenter":
        justifyContent = "center";
        alignItems = "flex-end";
        break;
      case "bottomRight":
        justifyContent = "flex-end";
        alignItems = "flex-end";
        break;
    }
    return { display, justifyContent, alignItems };
  };

  const alignStyles = $derived(getFlexAlignment());
</script>

<svelte:element
  this={as}
  style:display={alignStyles.display}
  style:justify-content={alignStyles.justifyContent}
  style:align-items={alignStyles.alignItems}
  style:width={width !== undefined ? toCssUnit(width) : undefined}
  style:height={height !== undefined ? toCssUnit(height) : undefined}
  style:padding={parseEdgeInsets(padding)}
  style:margin={parseEdgeInsets(margin)}
  style:background-color={color}
  style:border-radius={borderRadius !== undefined
    ? toCssUnit(borderRadius)
    : undefined}
  style:border
  style:box-shadow={boxShadow}
  style:position
  style:top={top !== undefined ? toCssUnit(top) : undefined}
  style:bottom={bottom !== undefined ? toCssUnit(bottom) : undefined}
  style:left={left !== undefined ? toCssUnit(left) : undefined}
  style:right={right !== undefined ? toCssUnit(right) : undefined}
  style:z-index={zIndex}
  {style}
>
  {#if children}{@render children()}{/if}
</svelte:element>
