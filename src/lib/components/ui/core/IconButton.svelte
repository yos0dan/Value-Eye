<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    onclick,
    variant = "ghost",
    size = "md",
    disabled = false,
    class: className = "",
  }: {
    children: Snippet;
    onclick?: (e: MouseEvent) => void;
    variant?: "primary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    class?: string;
  } = $props();
</script>

<button
  type="button"
  {onclick}
  {disabled}
  class="icon-btn {variant} size-{size} {className}"
>
  {@render children()}
</button>

<style>
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    flex-shrink: 0;
  }

  .icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ghost {
    background: transparent;
    color: var(--muted);
  }
  .ghost:hover:not(:disabled) {
    background: var(--surface-strong);
    color: var(--ink);
  }

  .primary {
    background: var(--primary);
    color: white;
  }

  .danger {
    background: transparent;
    color: var(--error);
  }
  .danger:hover:not(:disabled) {
    background: rgba(220, 30, 50, 0.1);
  }

  .size-sm {
    width: 32px;
    height: 32px;
  }
  .size-md {
    width: 44px;
    height: 44px;
  }
  .size-lg {
    width: 54px;
    height: 54px;
  }

  .icon-btn:active:not(:disabled) {
    transform: scale(0.92);
  }
</style>
