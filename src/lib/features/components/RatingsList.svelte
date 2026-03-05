<script lang="ts">
	import RatingsListItem from '$lib/features/components/RatingsListItem.svelte';
	import type { RatingRow } from '../../../routes/(private)/inbox/+page.server';

	type Props = {
		ratings: RatingRow[];
	};

	const { ratings }: Props = $props();
</script>

<div class="">
	{#if ratings.length === 0}
		<div class={'pt-5 pl-2 text-sm sm:text-base'}>** No ratings to display **</div>
	{:else}
		{#each ratings as rating}
			<RatingsListItem {rating} />
		{/each}
	{/if}
</div>
