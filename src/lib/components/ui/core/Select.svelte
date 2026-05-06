<script lang="ts">
  let {
    value = $bindable(),
    options = [],
    label,
    id = crypto.randomUUID(),
    disabled = false,
    class: className = "",
  }: {
    value: string;
    options: { label: string; value: string }[];
    label?: string;
    id?: string;
    disabled?: boolean;
    class?: string;
  } = $props();
</script>

<div class="field {className}">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <div class="select-wrapper">
    <select {id} {disabled} bind:value>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    <div class="arrow">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    width: 100%;
  }

  label {
    font-size: var(--font-size-xs);
    font-weight: var(--weight-bold);
    color: var(--body);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  select {
    width: 100%;
    height: 44px;
    padding: 0 36px 0 var(--space-md);
    background: var(--canvas);
    border: 1px solid var(--hairline);
    border-radius: var(--radius-md);
    color: var(--ink);
    font-size: var(--font-size-md);
    font-family: inherit;
    transition: border-color 0.2s;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    line-height: 42px; /* For vertical centering of Kanji */
  }

  select:focus {
    border-color: var(--primary);
  }

  select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .arrow {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--muted);
    display: flex;
  }
</style>
