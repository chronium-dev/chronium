<script lang="ts">
	import type { StatsList } from '$lib/server/db/queries/obligations';
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
debugger
	const formatDate = (d: string) =>
		new UTCDate(d).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
</script>

<div class="mx-auto max-w-4xl space-y-10">
	<!-- 🎉 Header -->
	<section class="space-y-2">
		<h1 class="text-2xl font-semibold">Organisation created successfully 🎉</h1>
		<p class="text-muted-foreground">
			Your statutory compliance schedule has been set up. These are obligations which have been
			created based on the company data you have just provided
		</p>
		<p class="text-muted-foreground">
			We have prepared these based on statutory events which arise over the next 24 months.
		</p>
	</section>

	<!-- 📊 Stats -->
	<section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class="rounded-2xl border p-4">
			<p class="text-sm text-muted-foreground">Upcoming obligations</p>
			<p class="text-2xl font-semibold">{data.obligations.length}</p>
		</div>

		<div class="divide-y rounded-2xl border">
			{#each data.obligations as item}
				<div class="flex items-center justify-between p-4">
					<div class="text-sm">
						{item.name}
					</div>
					<div class="text-sm text-muted-foreground">
						{item.count}
					</div>
				</div>
			{/each}
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
