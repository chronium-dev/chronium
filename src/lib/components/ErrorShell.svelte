<!-- src/lib/components/ErrorShell.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import type { ErrorRecovery } from '$lib/types/errors';
	import type { Snippet } from 'svelte';

	const { children, recovery } = $props<{
		children?: Snippet;
		recovery?: ErrorRecovery;
	}>();

	const status = $derived(page.status ?? 500);
	const message = $derived(page.error?.message ?? 'Something went wrong');

	const fallbackRecovery: ErrorRecovery = {
		href: '/',
		label: 'Go to Home page'
	};

	const link = $derived(recovery ?? fallbackRecovery);
</script>

<section class="mx-auto max-w-2xl py-24 text-center">
	<p class="text-sm font-semibold text-brand">
		{status}
	</p>

	<h1 class="mt-4 text-3xl font-semibold">
		{message}
	</h1>

	{#if children}
		<div class="mt-6">
			{@render children()}
		</div>
	{/if}

	<div class="mt-10">
		<a
			href={link.href}
			class="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/70"
		>
			{link.label}
		</a>
	</div>
</section>
