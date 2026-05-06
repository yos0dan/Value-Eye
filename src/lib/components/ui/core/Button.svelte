<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    onclick,
    type = "button",
    variant = "primary", // primary, ghost, danger, outline
    size = "md", // sm, md, lg
    disabled = false,
    class: className = "",
    width = "auto",
  }: {
    children: Snippet;
    onclick?: (e: MouseEvent) => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "ghost" | "danger" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    class?: string;
    width?: string;
  } = $props();
</script>

<button
  {type}
  {onclick}
  {disabled}
  class="btn {variant} size-{size} {className}"
  style:width
>
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    border: none;
    border-radius: var(--radius-full);
    font-weight: var(--weight-bold);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    outline: none;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Variants */
  .primary {
    background: var(--primary);
    color: var(--on-primary);
  }
  .primary:hover:not(:disabled) {
    background: var(--primary-active);
  }

  .ghost {
    background: transparent;
    color: var(--ink);
  }
  .ghost:hover:not(:disabled) {
    background: var(--surface-strong);
  }

  .danger {
    background: var(--error);
    color: white;
  }
  .danger:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  .outline {
    background: transparent;
    border: 1px solid var(--hairline);
    color: var(--ink);
  }
  .outline:hover:not(:disabled) {
    background: var(--surface-soft);
  }

  /* Sizes */
  .size-sm {
    height: 32px;
    padding: 0 var(--space-md);
    font-size: var(--font-size-xs);
  }
  .size-md {
    height: 44px;
    padding: 0 var(--space-lg);
    font-size: var(--font-size-sm);
  }
  .size-lg {
    height: 54px;
    padding: 0 var(--space-xl);
    font-size: var(--font-size-md);
  }

  .btn:active:not(:disabled) {
    transform: scale(0.97);
  }
</style>
