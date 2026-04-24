<script lang="ts">
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { interpolate } from '$lib/utils/interpolate';
	import { UTCDate } from '@date-fns/utc';

	// type SummaryData = {
	// 	totalObligations: number;
	// 	nextObligation?: {
	// 		name: string;
	// 		date: string;
	// 	};
	// 	upcoming: {
	// 		name: string;
	// 		date: string;
	// 	}[];
	// 	categories: string[];
	// };

	let { data } = $props();
	//const {obligations} = $derived(data);

	// let data: StatsList[];
	// debugger
	const formatDate = (d: string) =>
		new UTCDate(d).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
</script>

<div class="mx-auto max-w-4xl space-y-10 border border-red-300">
	<!-- 🎉 Header -->
	<section class="mt-2 space-y-2 text-center">
		<h1 class="text-2xl font-semibold">{`${data.org?.name} has been setup successfully!`}</h1>
		<p class="text-balance text-muted-foreground">
			{`Chronium has mapped out your upcoming statutory obligations for the next ${data.horizonMonths} months.`}
		</p>
		<p class="text-muted-foreground">
			These obligations were generated using: your incorporation date financial year end VAT
			settings payroll configuration
		</p>
	</section>

	<!-- 📊 Stats -->
	<section class="mx-auto space-y-2 px-5 sm:max-w-[75%]">
		<!-- <div class="rounded-2xl border p-4">
			<p class="text-sm text-muted-foreground">Upcoming obligations</p>
			<p class="text-2xl font-semibold">{data.obligations.length}</p>
		</div> -->

		<div class="divide-y rounded-2xl border">
			<!-- {#each data.obligations as item}
				<div class="flex items-center justify-between p-4">
					<div class="text-sm">
						{item.name}
					</div>
					<div class="text-sm text-muted-foreground">
						{item.count}
					</div>
				</div>
			{/each} -->

			<Accordion.Root type="multiple" class="w-full sm:max-w-full">
				{#each data.obligations as item}
					<Accordion.Item value={item.key} class="px-4">
						<Accordion.Trigger class="p-0 pt-2">
							<SectionHeader
								title={item.name}
								description={`${item.dates.length} upcoming deadlines`}
								class="m-0 p-0"
							/>
						</Accordion.Trigger>
						<Accordion.Content class="flex flex-col text-balance">
							{#each item.dates as dateItem}
								<div class="my-0 flex flex-row gap-8 p-0">
									<dt class="font-medium">
										Due: {dateItem.due_date}
									</dt>
									{#if item.event_label && dateItem.event_date}
										<dd class="mt-0 text-muted-foreground">
											{interpolate(item.event_label, { eventDate: dateItem.event_date })}
										</dd>
									{/if}
								</div>
							{/each}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</div>

		<!-- <div class="rounded-2xl border p-4">
			<p class="text-sm text-muted-foreground">Next deadline</p>
			{#if data.nextObligation}
				<p class="text-lg font-medium">
					{formatDate(data.nextObligation.date)}
				</p>
				<p class="text-sm text-muted-foreground">
					{data.nextObligation.name}
				</p>
			{:else}
				<p class="text-sm text-muted-foreground">None scheduled</p>
			{/if}
		</div> -->

		<!-- <div class="rounded-2xl border p-4">
			<p class="text-sm text-muted-foreground">Coverage</p>
			<p class="text-sm">
				{data.categories.join(', ')}
			</p>
		</div> -->
	</section>

	<!-- 📅 Upcoming -->
	<!-- <section class="space-y-3">
		<h2 class="text-lg font-semibold">Next deadlines</h2>

		<div class="rounded-2xl border divide-y">
			{#each data.upcoming.slice(0, 5) as item}
				<div class="flex items-center justify-between p-4">
					<div class="text-sm">
						{item.name}
					</div>
					<div class="text-sm text-muted-foreground">
						{formatDate(item.date)}
					</div>
				</div>
			{/each}
		</div>
	</section> -->

	<!-- ✅ Included -->
	<!-- <section class="space-y-3">
		<h2 class="text-lg font-semibold">Included in your compliance pack</h2>

		<ul class="text-sm space-y-1">
			{#each data.categories as c}
				<li>✓ {c}</li>
			{/each}
		</ul>
	</section> -->

	<!-- 🚀 CTA -->
	<section class="flex items-center justify-between pt-4">
		<a
			href="/onboarding/next-step"
			class="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
		>
			Continue setup →
		</a>

		<a href="/dashboard" class="text-sm text-muted-foreground hover:underline"> Go to dashboard </a>
	</section>
</div>
