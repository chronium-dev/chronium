<script lang="ts">
	import CompactHeader from '$lib/components/CompactHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	let {
		open,
		title,
		description,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		onConfirm
	} = $props<{
		open: boolean;
		title: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		onConfirm: () => void;
	}>();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-sm p-0">
		<CompactHeader {title} />

		<div class="space-y-4 px-4 py-4">
			{#if description}
				<p class="text-sm text-muted-foreground">
					{description}
				</p>
			{/if}

			<div class="flex justify-end gap-2">
				<Button variant="ghost" onclick={() => (open = false)}>
					{cancelLabel}
				</Button>

				<Button
					variant="destructive"
					onclick={() => {
						onConfirm();
						open = false;
					}}
				>
					{confirmLabel}
				</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

<!-- USAGE EXAMPLE -->

<!-- <script lang="ts">
	let confirmOpen = false;

	function deleteTemplate() {
		// destructive action
	}
</script>

<Button
	variant="destructive"
	size="sm"
	on:click={() => (confirmOpen = true)}
>
	Delete template
</Button>

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete template"
	description="This will permanently remove the template and all associated responses."
	confirmLabel="Delete"
	onConfirm={deleteTemplate}
/>

 -->
