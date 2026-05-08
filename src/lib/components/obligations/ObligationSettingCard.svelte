<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import RecurrenceEditor from './RecurrenceEditor.svelte';

	let { setting = $bindable() } = $props();
</script>

<Card.Root>
	<Card.Content class="space-y-6 p-6">
		<div class="flex items-start gap-4">
			<Checkbox bind:checked={setting.enabled} />

			<div class="space-y-1">
				<div class="font-medium">
					{setting.template.name}
				</div>

				<div class="text-sm text-muted-foreground">
					{setting.template.category}
				</div>
			</div>
		</div>

		{#if setting.enabled}
			<RecurrenceEditor bind:setting />
		{/if}
	</Card.Content>
</Card.Root>
