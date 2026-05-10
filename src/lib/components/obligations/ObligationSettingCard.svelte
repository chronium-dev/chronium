<script lang="ts">
	import RecurrenceEditor from '$lib/components/obligations/RecurrenceEditor.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { ObligationSetting } from '$lib/validations/obligation-settings';

	let { setting }: { setting: ObligationSetting } = $props();
</script>

<Card.Root>
	<Card.Content class="">
		<div class="flex items-start gap-4">
			<!-- Switch from bind:checked to this: -->
			<Checkbox
				checked={setting.enabled}
				onCheckedChange={(v) => {
					setting.enabled = !!v;
				}}
			/>

			<!-- <input type="checkbox" bind:checked={setting.enabled} /> -->

			<div class="space-y-1">
				<div class="font-medium">
					{setting.obligationTemplateName}
				</div>

				<div class="text-sm text-muted-foreground">
					{setting.category}
				</div>
			</div>
		</div>

		<p>{setting.enabled}</p>

		{#if setting.enabled}
			<div>
				<p>Enabled!</p>
				<RecurrenceEditor bind:setting />
			</div>
		{/if}
	</Card.Content>
</Card.Root>
