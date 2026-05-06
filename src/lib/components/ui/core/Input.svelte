<script lang="ts">
  let {
    value = $bindable(),
    label,
    placeholder = "",
    type = "text",
    id = crypto.randomUUID(),
    disabled = false,
    class: className = "",
    suffix,
  }: {
    value: string | number | undefined;
    label?: string;
    placeholder?: string;
    type?: string;
    id?: string;
    disabled?: boolean;
    class?: string;
    suffix?: string;
  } = $props();
</script>

<div class="field {className}">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <div class="input-wrapper">
    <input
      {id}
      {type}
      {placeholder}
      {disabled}
      bind:value
    />
    {#if suffix}
      <span class="suffix">{suffix}</span>
    {/if}
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

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input {
    width: 100%;
    height: 44px;
    padding: 0 var(--space-md);
    background: var(--canvas);
    border: 1px solid var(--hairline);
    border-radius: var(--radius-md);
    color: var(--ink);
    font-size: var(--font-size-md);
    font-family: inherit;
    transition: border-color 0.2s;
    outline: none;
  }

  input:focus {
    border-color: var(--primary);
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .suffix {
    position: absolute;
    right: var(--space-md);
    color: var(--muted);
    font-size: var(--font-size-sm);
    pointer-events: none;
  }
</style>
