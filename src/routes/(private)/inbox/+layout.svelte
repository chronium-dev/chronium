<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<main class="mx-auto w-full border border-green-500 ">
	{@render children()}
</main>
