<script lang="ts">
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
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

<div class="mx-auto max-w-4xl space-y-10">
	<!-- 🎉 Header -->
	<section class="mt-2 space-y-1 text-center">
		<div class="mx-auto space-y-2 rounded-2xl border py-2 sm:max-w-[75%]">
			<h1 class="text-2xl font-semibold">{`${data.org?.name} is ready!`}</h1>
			<p class="my-4 text-balance text-muted-foreground">
				{`We've generated your statutory compliance obligations for the next  ${data.horizonMonths} months based on the company information you provided.`}
			</p>
			<div>
				<p class="my-3 text-muted-foreground">This includes obligations related to:</p>
				<ul
					class="mx-auto w-fit list-disc space-y-2 pl-5 text-left text-muted-foreground marker:text-brand"
				>
					<li>Companies House filings</li>
					<li>Corporation Tax</li>
					<li>VAT</li>
					<li>Payroll / PAYE</li>
				</ul>
				<p class="mt-5 px-20 text-balance text-muted-foreground">
					These deadlines have been calculated using your incorporation date, financial year end,
					VAT and payroll settings.
				</p>
			</div>
		</div>
	</section>

	<!-- 📊 Stats -->
	<section class="mx-auto space-y-2 sm:max-w-[75%]">
		<!-- <div class="rounded-2xl border p-4">
			<p class="text-sm text-muted-foreground">Upcoming obligations</p>
			<p class="text-2xl font-semibold">{data.obligations.length}</p>
		</div> -->

		<div class="divide-y rounded-2xl border">
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
						<Accordion.Content class="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-1">
							{#each item.dates as dateItem}
								<dt class="font-medium whitespace-nowrap">
									Due: {dateItem.due_date}
								</dt>

								{#if item.event_label && dateItem.event_date}
									<dd class="text-muted-foreground">
										{interpolate(item.event_label, { eventDate: dateItem.event_date })}
									</dd>
								{:else}
									<div></div>
								{/if}
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

	<p class="mt-5 px-20 text-balance text-muted-foreground">
					These deadlines have been calculated using your incorporation date, financial year end,
					VAT and payroll settings.
				</p>

	<!-- 🚀 CTA -->
	<section class="mb-2 flex justify-center gap-5">
		<a href="/onboarding/next-step" class={buttonVariants({ variant: 'default' })}>
			Continue setup →
		</a>

		<a href="/dashboard" class={buttonVariants({ variant: 'outline' })}> Go to dashboard </a>
	</section>
</div>
