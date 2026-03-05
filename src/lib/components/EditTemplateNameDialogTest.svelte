<script lang="ts">
	import CompactHeader from '$lib/components/CompactHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from '$lib/components/ui/input';
	import { X } from 'lucide-svelte';

	let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button size="sm" variant="outline">Rename</Button>
	</Dialog.Trigger>

	<Dialog.Content class="p-0">
		<CompactHeader title="Rename template">
			<Button variant="ghost" size="icon" onclick={() => (open = false)}>
				<X class="h-4 w-4" />
			</Button>
		</CompactHeader>

		<div class="px-4 py-4 space-y-4">
			<!-- modal content -->
			<Input value="Template name...." />

			<div class="flex justify-end gap-2">
				<Button variant="ghost" onclick={() => (open = false)}>
					Cancel
				</Button>
				<Button>Save</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
