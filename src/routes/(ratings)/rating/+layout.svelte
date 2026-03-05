<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<main class="mx-auto w-full border border-pink-500 px-4 py-6">
	{@render children()}
</main>
