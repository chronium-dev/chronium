<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	// import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import '../../routes/layout.css';

	let { children } = $props();

	// onMount(() => {
	// 	theme.init();
	// });

	const navigateTo = (path: string) => {
		goto(path);
		// menuOpen = false;
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<HeaderBar />

	<main class="flex-1">
		{@render children?.()}
	</main>

	<Footer />
</div>
