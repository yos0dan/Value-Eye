<script lang="ts">
  import type { Snippet } from "svelte";
  import Container from "./Container.svelte";
  import { theme } from "$lib/styles/theme";

  let {
    children,
    appBar,
    bottomNavigationBar,
    floatingActionButton,
    backgroundColor = theme.colors.bg,
  }: {
    children?: Snippet; // the body
    appBar?: Snippet;
    bottomNavigationBar?: Snippet;
    floatingActionButton?: Snippet;
    backgroundColor?: string;
  } = $props();
</script>

<div class="scaffold-layout" style="background-color: {backgroundColor};">
  <div class="scaffold-main">
    {#if appBar}
      <Container
        as="header"
        position="sticky"
        top={0}
        zIndex={15000}
        width="100%"
        color={backgroundColor}
      >
        {@render appBar()}
      </Container>
    {/if}

    <!-- Body -->
    <main class="scaffold-content">
      {#if children}
        {@render children()}
      {/if}
    </main>

    <!-- Floating Action Button -->
    {#if floatingActionButton}
      <Container
        position="fixed"
        bottom={bottomNavigationBar
          ? "calc(95px + env(safe-area-inset-bottom))"
          : "24px"}
        right="20px"
        zIndex={45}
      >
        {@render floatingActionButton()}
      </Container>
    {/if}
  </div>

  <!-- Navigation Bar -->
  {#if bottomNavigationBar}
    <nav class="scaffold-nav" style="background-color: {backgroundColor};">
      {@render bottomNavigationBar()}
    </nav>
  {/if}
</div>

<style>
  .scaffold-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
  }

  .scaffold-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    /* Add bottom padding equal to mobile nav bar height + safe area */
    padding-bottom: calc(85px + env(safe-area-inset-bottom)); 
  }


  .scaffold-content {
    flex: 1;
    width: 100%;
  }

  .scaffold-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 20000;
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    border-top: 1px solid var(--hairline);
  }


  /* Desktop layout override */
  @media (min-width: 768px) {
    .scaffold-layout {
      flex-direction: row;
    }
    
    .scaffold-nav {
      position: sticky;
      top: 0;
      bottom: auto;
      left: auto;
      height: 100vh;
      box-shadow: 1px 0 4px rgba(0, 0, 0, 0.05);
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      width: 80px; 
      flex-shrink: 0;
      order: -1; /* place it before the main content */
      padding-bottom: 0;
    }

    .scaffold-main {
      padding-bottom: 0px; 
      width: calc(100% - 80px);
    }
  }
</style>
