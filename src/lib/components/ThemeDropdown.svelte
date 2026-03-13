<script lang="ts">
	import {
		DropdownMenuItem,
		DropdownMenuSub,
		DropdownMenuSubContent,
		DropdownMenuSubTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { theme } from '$lib/stores/theme';
	import { Check, Monitor, Moon, Sun } from '@lucide/svelte';

	const items = [
		{ label: 'Light', value: 'light', icon: Sun },
		{ label: 'Dark', value: 'dark', icon: Moon },
		{ label: 'System', value: 'system', icon: Monitor }
	] as const;
</script>

<DropdownMenuSub>
	<DropdownMenuSubTrigger class="flex items-center gap-2">
		{#if $theme === 'light'}<Sun class="h-4 w-4" />
		{:else if $theme === 'dark'}<Moon class="h-4 w-4" />
		{:else}<Monitor class="h-4 w-4" />{/if}
		<span>Theme</span>
	</DropdownMenuSubTrigger>
	<DropdownMenuSubContent align="center">
		{#each items as item}
			<DropdownMenuItem onclick={() => theme.set(item.value)} class="flex items-center gap-2">
				<svelte:component this={item.icon} class="h-4 w-4" />
				<span>{item.label}</span>
				{#if $theme === item.value}
					<Check class="ml-auto h-4 w-4 text-muted-foreground" />
				{/if}
			</DropdownMenuItem>
		{/each}
	</DropdownMenuSubContent>
</DropdownMenuSub>
