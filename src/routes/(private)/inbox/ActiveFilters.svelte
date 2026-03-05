<script lang="ts">
	import { page } from '$app/state';
	import type { ActiveFilters } from './+page.server';

	let { label, column, activeFilters } = $props<{
		label: string;
		column: ActiveFilters['sort'];
		activeFilters: ActiveFilters;
	}>();

	const sortUrl = $derived.by(() => {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('sort', column);
		
		// If clicking the current column, toggle direction
		if (activeFilters.sort === column) {
			params.set('dir', activeFilters.dir === 'asc' ? 'desc' : 'asc');
		} else {
			params.set('dir', 'desc');
		}
		
		// Critical: Reset pagination when sort changes
		params.delete('after');
		params.delete('before');
		
		return `?${params.toString()}`;
	});

	const isActive = $derived(activeFilters.sort === column);
</script>

<th class="px-4 py-2 text-left font-medium text-gray-700">
	<a href={sortUrl} class="group inline-flex items-center gap-1 hover:text-blue-600">
		{label}
		<span class="transition-opacity {isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}">
			{#if isActive && activeFilters.dir === 'asc'}
				↑
			{:else}
				↓
			{/if}
		</span>
	</a>
</th>