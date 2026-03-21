<script lang="ts">
  let { error } = $props()
</script>

{#if error}
  <p class="text-red-500 text-sm">{error}</p>
{/if}