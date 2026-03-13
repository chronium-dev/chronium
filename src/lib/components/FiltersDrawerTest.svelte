<script lang="ts">
	import CompactHeader from '$lib/components/CompactHeader.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { X } from '@lucide/svelte';

	let open = false;
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		<Button size="sm" variant="outline">Filters</Button>
	</Sheet.Trigger>

	<Sheet.Content side="right" class="w-full p-0 sm:max-w-md">
		<CompactHeader title="Filters">
			<Button variant="ghost" size="icon" onclick={() => (open = false)}>
				<X class="h-4 w-4" />
			</Button>
		</CompactHeader>

		<div class="space-y-6 px-4 py-4">
			<SectionHeader title="Date range" />
			<!-- <DateRangePicker /> -->

			<SectionHeader title="Score" />
			<!-- <ScoreFilter /> -->

			<div class="flex justify-end gap-2 pt-4">
				<Button variant="ghost">Reset</Button>
				<Button>Apply</Button>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
