<script lang="ts">
  import Container from "$lib/components/ui/Container.svelte";
  import Column from "$lib/components/ui/Column.svelte";
  import Text from "$lib/components/ui/Text.svelte";
  import { theme } from "$lib/styles/theme";
</script>

<svelte:head>
  <title>Map - バリュー眼</title>
</svelte:head>

<Container
  width="100%"
  height="60vh"
  alignment="center"
  style="position: relative; overflow: hidden; border-radius: 16px; min-height: 400px;"
>
  <!-- Blurred Background Map Mockup -->
  <div
    style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; background-image: url('https://upload.wikimedia.org/wikipedia/commons/e/e0/OpenStreetMap_routing_example.png'); background-size: cover; background-position: center; filter: blur(8px); opacity: 0.35;"
  ></div>

  <Column
    gap={24}
    crossAxisAlignment="center"
    mainAxisAlignment="center"
    style="position: relative; z-index: 10;"
  >
    <Text
      fontSize={theme.typography.sizes.h1}
      fontWeight={theme.typography.weights.extrabold}
      color={theme.colors.textPrimary}
      textAlign="center"
      style="line-height: 1.2;"
    >
      Coming Soon<br />on the App
    </Text>
    <Text
      fontSize={theme.typography.sizes.sm}
      color={theme.colors.textSecondary}
      textAlign="center"
    >
      ネイティブアプリ版のリリースを<br />お待ちください
    </Text>
  </Column>
</Container>
