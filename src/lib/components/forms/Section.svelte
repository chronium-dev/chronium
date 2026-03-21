<script lang="ts">
  let { title } = $props()
</script>

<div class="space-y-4">
  <h2 class="text-lg font-semibold">{title}</h2>
  <slot /> <!-- children of section -->
</div>