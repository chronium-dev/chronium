<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-xl">
	<PageHeader title="Orgs list...." align="center" class="mb-2" />
</div>
