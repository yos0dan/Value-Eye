<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    padding = "16px",
    borderRadius = "var(--radius-lg)",
    bg = "var(--surface-card)",
    border = "1px solid var(--hairline)",
    shadow = "var(--shadow-card)",
    class: className = "",
    onclick,
    role,
    tabindex,
  }: {
    children: Snippet;
    padding?: string;
    borderRadius?: string;
    bg?: string;
    border?: string;
    shadow?: string;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    role?: string;
    tabindex?: number;
  } = $props();
</script>

{#if onclick}
  <button
    {role}
    {tabindex}
    {onclick}
    class="card interactive {className}"
    style:padding
    style:border-radius={borderRadius}
    style:background={bg}
    style:border
    style:box-shadow={shadow}
  >
    {@render children()}
  </button>
{:else}
  <div
    class="card {className}"
    style:padding
    style:border-radius={borderRadius}
    style:background={bg}
    style:border
    style:box-shadow={shadow}
  >
    {@render children()}
  </div>
{/if}

<style>
  .card {
    width: 100%;
    box-sizing: border-box;
    display: block;
    text-align: left;
    color: inherit;
    font-family: inherit;
  }

  .interactive {
    cursor: pointer;
    border: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    outline: none;
    background: none;
    padding: 0;
  }

  .interactive:active {
    transform: scale(0.98);
  }
</style>
