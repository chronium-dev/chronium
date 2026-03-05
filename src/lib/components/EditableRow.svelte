<script lang="ts">
	import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
	import EditIcon from '$lib/components/icons/EditIcon.svelte';
	import XIcon from '$lib/components/icons/XIcon.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';

	// Global store to enforce single active edit
	export const activeEdit = writable<string | null>(null);

	export let value: string;
	export let fieldKey: string;
	export let textarea: boolean = false;
	export let maxLength: number | null = null;
	export let className: string = '';

	// Callback instead of event dispatcher (Svelte 5)
	export let onSave: (payload: { fieldKey: string; value: string }) => Promise<void> | void;

	let draft: string | null = null;
	let mode: 'view' | 'edit' | 'saving' = 'view';
	let inputEl: HTMLInputElement | HTMLTextAreaElement | null = null;

	// Cancel this row if another row becomes active
	activeEdit.subscribe((activeKey) => {
		if (activeKey !== fieldKey && mode === 'edit') {
			cancel();
		}
	});

	async function edit() {
		activeEdit.set(fieldKey);
		draft = value;
		mode = 'edit';
		await tick();
		inputEl?.focus();
	}

	function cancel() {
		draft = null;
		mode = 'view';
		activeEdit.update((key) => (key === fieldKey ? null : key));
	}

	async function save() {
		if (draft === null) return;

		mode = 'saving';
		await onSave({ fieldKey, value: draft });

		value = draft;
		draft = null;
		mode = 'view';
		activeEdit.update((key) => (key === fieldKey ? null : key));
	}
</script>

<div class={`grid grid-cols-[1fr_auto] items-start gap-x-4 ${className}`}>
	<!-- Preview box -->
	<!-- <div
		class={`rounded p-3 transition-all duration-150 ${
			mode === 'edit' ? 'scale-[1.02] bg-gray-50' : ''
		}`}
	> -->
	<div
		class={`border-x border-slate-300 px-5 py-1.5 transition-all duration-150 ${mode === 'edit' ? '' : ''}`}
	>
		{#if mode === 'edit'}
			{#if textarea}
				<textarea
					bind:this={inputEl}
					class="w-full resize-none border-none bg-transparent p-0 text-wrap outline-none"
					rows="3"
					bind:value={draft}
					maxlength={maxLength ?? undefined}
					on:keydown={(e) => e.key === 'Escape' && cancel()}
				></textarea>
			{:else}
				<input
					bind:this={inputEl}
					class="w-full border-none bg-transparent p-0 outline-none"
					type="text"
					bind:value={draft}
					maxlength={maxLength ?? undefined}
					on:keydown={(e) => {
						if (e.key === 'Enter') save();
						if (e.key === 'Escape') cancel();
					}}
				/>
			{/if}
		{:else}
			<p class='whitespace-pre-line'>{value}</p>
		{/if}

		<slot name="after" />
	</div>

	<!-- Floating edit controls -->
	<div class="flex flex-col gap-2 pt-2 text-xs text-muted-foreground">
		{#if mode === 'view'}
			<button on:click={edit} aria-label="Edit"><EditIcon class="h-4 w-4" /></button>
		{:else if mode === 'edit'}
			<button on:click={save} aria-label="Save" class="disabled:opacity-50"
				><CheckIcon class="h-4 w-4 text-green-500" /></button
			>
			<button on:click={cancel} aria-label="Cancel"><XIcon class="h-4 w-4 text-red-500" /></button>
		{:else}
			<span><Spinner class="h4 w-4 text-blue-600" /></span>
		{/if}
	</div>
</div>
