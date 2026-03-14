<script lang="ts">
	import { browser } from '$app/environment';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { theme, type ThemeMode } from '$lib/stores/theme';

	import { Check, Monitor, Moon, Sun } from '@lucide/svelte';
	import { onDestroy } from 'svelte';

	let mode: ThemeMode = $state('system');
	// theme.subscribe((v) => (mode = v));
	const unsubscribe = theme.subscribe((v) => (mode = v));
	onDestroy(unsubscribe);

	const items = [
		{ label: 'Light', value: 'light', icon: Sun },
		{ label: 'Dark', value: 'dark', icon: Moon },
		{ label: 'System', value: 'system', icon: Monitor }
	] as const;

	function setMode(value: ThemeMode) {
		theme.set(value);
	}
</script>

{#if browser}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<div>
				<!-- Animated icon swap -->
				<span
					class="absolute transition-all duration-300
				       {mode === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}"
				>
					<Sun class="mt-0.5 h-4 w-4" />
				</span>

				<span
					class="absolute transition-all duration-300
				       {mode === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'}"
				>
					<Moon class="mt-0.5 h-4 w-4" />
				</span>

				<span
					class="absolute transition-all duration-300
				       {mode === 'system' ? 'scale-100 rotate-0' : 'scale-0'}"
				>
					<Monitor class="mt-0.5 h-4 w-4" />
				</span>
				<span
					class="ml-5 font-medium text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
					>Theme</span
				>
			</div>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end" class="w-36">
			{#each items as item}
				<DropdownMenuItem onclick={() => setMode(item.value)} class="flex items-center gap-2">
					<item.icon class="h-4 w-4" />
					<span>{item.label}</span>

					{#if mode === item.value}
						<Check class="ml-auto h-4 w-4 text-muted-foreground" />
					{/if}
				</DropdownMenuItem>
			{/each}
		</DropdownMenuContent>
	</DropdownMenu>
{/if}
