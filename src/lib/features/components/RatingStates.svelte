<script lang="ts">
  // import { getRatingStatusEnumValueFromString } from '@/types/ratings';
  import RatingStateLabel from './RatingStateLabel.svelte';

  let { status } = $props<{ status: string }>();

  // Transform the string to the enum reactively
  //const stat = $derived(getRatingStatusEnumValueFromString(status));
</script>

<RatingStateLabel {status} />