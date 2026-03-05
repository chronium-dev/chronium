<script lang="ts">
	import StarIcon from '$lib/components/icons/StarIcon.svelte';

	// Svelte 5 uses the $props rune
	let { ratingValue }: { ratingValue: number } = $props();

	const stars = [0, 1, 2, 3, 4];
</script>

<div class="flex items-center">
	{#each stars as rating}
		<StarIcon
			class="size-5"
			fill={ratingValue > rating ? '#ffc107' : '#a9a9a9'}
			color={ratingValue > rating ? '#ffc107' : '#a9a9a9'}
		/>
	{/each}
</div>
