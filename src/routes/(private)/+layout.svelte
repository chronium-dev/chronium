<script lang="ts">
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<HeaderBar />

<main class="mx-auto w-full border border-yellow-300">
	<div class='p-3'>
		{@render children()}
	</div>
</main>
