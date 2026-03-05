<script lang="ts">
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { toast } from 'svelte-sonner';

	type Props = {
		url: string;
	};

	//const { items } = $props<Props>();
	const { url }: Props = $props();
</script>

<div class="mb-2 flex space-x-2">
	<div class="">
		<span class="pr-2 text-sm font-semibold">Survey URL:</span>
		<span class="flex flex-col items-start text-xs sm:flex-row sm:items-center">
			<a href={url} target="_blank" class="break-all">
				<span class="break-all">{url}</span>
			</a>
		</span>
	</div>

	<div class="mt-1">
		<Tooltip>
			<TooltipTrigger>
				<Button
					variant="ghost"
					type="button"
					onclick={() => {
						void navigator.clipboard.writeText(url);
						// console.log('success');
						toast.success('URL copied to clipboard');
					}}
					class={'mx-1 flex-none text-orange-500'}
				>
					<CopyIcon class="mr-2 size-4" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Copy to clipboard</p>
			</TooltipContent>
		</Tooltip>
	</div>
</div>
