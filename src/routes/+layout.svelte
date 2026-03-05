<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import './layout.css';

	let { children } = $props();

	onMount(() => {
		theme.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />
{@render children()}
