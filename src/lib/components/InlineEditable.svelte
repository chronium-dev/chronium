<script lang="ts">
	import { Check, Pencil, X } from 'lucide-svelte';
	import { tick } from 'svelte';

	// 1. Props (replaces export let)
	let {
		value,
		multiline = false,
		placeholder = '',
		readonly = false,
		className = '',
		maxlength,
		onSave = () => {}
	} = $props<{
		value: string;
		multiline?: boolean;
		placeholder?: string;
		readonly?: boolean;
		className?: string;
		maxlength?: number;
		onSave?: (value: string) => void;
	}>();

	// 2. Reactive State (replaces let)
	let editing = $state(false);
	// svelte-ignore state_referenced_locally
		let draft = $state(value);
	let fieldEl = $state<HTMLInputElement | HTMLTextAreaElement>();

	// 3. Derived State (replaces manual onInputChange)
	let hasChanged = $derived(draft !== value);

	// Keep draft in sync if external value changes while NOT editing
	$effect(() => {
		if (!editing) draft = value;
	});

	async function startEdit() {
		if (readonly) return;
		draft = value;
		editing = true;
		await tick();
		fieldEl?.focus();
	}

	function cancelEdit() {
		draft = value;
		editing = false;
	}

	function commitEdit() {
		editing = false;
		if (hasChanged && draft.trim()) {
			onSave(draft.trim());
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') cancelEdit();
		if (e.key === 'Enter' && !multiline) commitEdit();
	}
</script>

<!-- <script lang="ts">
	import { Check, Pencil, X } from 'lucide-svelte';
	import { tick } from 'svelte';

	export let value: string;
	export let multiline = false;
	export let placeholder = '';
	export let readonly = false;
	export let className = '';
	export let maxlength: number | undefined;

	export let onSave: (value: string) => void = () => {};

	let editing = false;
	let draft = value;
	let hasChanged = false;
	let fieldEl: HTMLInputElement | HTMLTextAreaElement;

	async function startEdit() {
		if (readonly) return;
		draft = value;
		hasChanged = false;
		editing = true;
		await tick();
		fieldEl?.focus();
	}

	function cancelEdit() {
		draft = value;
		hasChanged = false;
		editing = false;
	}

	function commitEdit() {
		editing = false;
		if (draft !== value && draft.trim()) {
			onSave(draft.trim());
			hasChanged = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') cancelEdit();
		if (e.key === 'Enter' && !multiline) commitEdit();
	}

	function onInputChange() {
		hasChanged = draft !== value;
	}
</script> -->

<div class={`group relative ${className}`}>
	{#if editing}
		<div class="flex items-center gap-2">
			<div class="w-full flex-11">
				{#if multiline}
					<textarea
						bind:this={fieldEl}
						bind:value={draft}
						{placeholder}
						onkeydown={handleKeydown}
						{maxlength}
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
					></textarea>
				{:else}
					<input
						bind:this={fieldEl}
						bind:value={draft}
						{placeholder}
						onkeydown={handleKeydown}
						{maxlength}
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
					/>
				{/if}
			</div>

			<!-- Action icons outside the input -->
			<div class="flex flex-row items-center gap-1">
				{#if hasChanged}
					<button
						type="button"
						onclick={commitEdit}
						class="rounded p-1 hover:bg-green-100 dark:hover:bg-green-900"
					>
						<Check size={18} class="text-green-600 dark:text-green-400" />
					</button>
				{/if}
				<button
					type="button"
					onclick={cancelEdit}
					class="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900"
				>
					<X size={18} class="text-red-600 dark:text-red-400" />
				</button>
			</div>
		</div>
	{:else}
		<div class="flex w-full items-center justify-between">
			<button type="button" class="w-full text-left" onclick={startEdit}>
				<span>{value || placeholder}</span>
			</button>
			{#if !readonly}
				<button
					type="button"
					onclick={startEdit}
					class="ml-2 rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
				>
					<Pencil size={18} class="opacity-80" />
				</button>
			{/if}
		</div>
	{/if}
</div>
