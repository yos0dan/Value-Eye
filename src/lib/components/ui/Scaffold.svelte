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

<Container
  width="100%"
  color={backgroundColor}
  style="min-height: 100vh; position: relative; display: flex; flex-direction: column;"
>
  {#if appBar}
    <Container
      as="header"
      position="sticky"
      top={0}
      zIndex={40}
      width="100%"
      color={backgroundColor}
    >
      {@render appBar()}
    </Container>
  {/if}

  <!-- Body -->
  <Container as="main" width="100%" style="flex: 1;">
    {#if children}
      {@render children()}
    {/if}
  </Container>

  <!-- Floating Action Button -->
  {#if floatingActionButton}
    <Container
      position="fixed"
      bottom={bottomNavigationBar
        ? "calc(80px + env(safe-area-inset-bottom))"
        : "24px"}
      right="20px"
      zIndex={45}
    >
      {@render floatingActionButton()}
    </Container>
  {/if}

  <!-- Bottom Navigation Bar -->
  {#if bottomNavigationBar}
    <Container
      as="footer"
      position="fixed"
      bottom={0}
      left={0}
      width="100%"
      zIndex={50}
      color={backgroundColor}
      style="padding-bottom: env(safe-area-inset-bottom);"
      border={`1px solid transparent`}
      boxShadow="0 -1px 4px rgba(0, 0, 0, 0.05)"
    >
      {@render bottomNavigationBar()}
    </Container>
  {/if}
</Container>
