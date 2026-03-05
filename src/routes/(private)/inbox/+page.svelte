<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import RatingsList from '$lib/features/components/RatingsList.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	// Use $derived for easy access to the pieces (NB: ChatGPT advised against this method...?)
	//const { ratings, pagination, activeFilters } = $derived(data);
	const ratings = $derived(data.ratings);
	const pagination = $derived(data.pagination);
	const activeFilters = $derived(data.activeFilters);

	// debugger;

	function goNext() {
		if (!pagination.nextCursor) return;

		const params = new URLSearchParams(page.url.searchParams);
		params.set('after', pagination.nextCursor);
		params.delete('before');

		goto(`?${params.toString()}`, {
			replaceState: true,
			noScroll: true
		});
	}

	function goPrev() {
		if (!pagination.prevCursor) return;

		const params = new URLSearchParams(page.url.searchParams);
		params.set('before', pagination.prevCursor);
		params.delete('after');

		goto(`?${params.toString()}`, {
			replaceState: true,
			noScroll: true
		});
	}
</script>

<div class="">
	<div>
		<div class="sm:hidden">
			<PageHeader
				title="Ratings Received"
				description="Ratings received from customers including conversations"
				align="left"
			/>

			<!-- <pre>{JSON.stringify(props, null, 2)}</pre> -->

			<!-- <div class='mt-8 flex flex-row justify-between pl-2'>
          <CountAndSearch count={count} />
        </div>

        <If condition={activeFilters}>
          <div class='mt-4'>
            <RatingsFilterIndicator orgId={orgId} filters={filters} storeKey='ratings-list-filter-show-state' />
          </div>
        </If>

        <RatingsMobileSettings class='' activeFilters={activeFilters} sorting={cleaned.sort ?? 'touched_at.desc'} hideClosedTasks={hideClosedTasks} /> -->
		</div>

		<div class="hidden flex-wrap items-center justify-between sm:flex">
			<PageHeader
				title="Ratings Inbox"
				description="Ratings received from customers including conversations"
				align="left"
			/>
		</div>

		<div
			class="mt-0 animate-in delay-150 duration-300 ease-out fill-mode-both zoom-in-50 fade-in sm:mt-4"
		>
			<RatingsList {ratings} />
			<Button type="button" variant='ghost' disabled={!pagination.prevCursor} onclick={goPrev}> ← Previous </Button>
			<Button type="button" variant='ghost' disabled={!pagination.nextCursor} onclick={goNext}> Next → </Button>
		</div>
	</div>
</div>
