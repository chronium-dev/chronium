<script lang="ts">
  let { label, forId } = $props()
</script>

<div class="space-y-1">
  <label for={forId} class="text-sm font-medium">{label}</label>
  <slot /> <!-- render parent content -->
</div>
