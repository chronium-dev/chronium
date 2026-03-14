<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';

	let { data, form }: PageProps = $props();
	let pending = $state(false);
</script>

<div class="rounded-lg bg-background p-8 shadow-lg">
	<div class="mb-8 text-center">
		<!-- <div class="mx-auto w-fit">
			<LogoIcon width={48} height={48} />
		</div> -->
		<h2 class="text-2xl font-bold">Setup Your Company</h2>
	</div>

	{#if form?.formError}
		<p class="mb-4 text-sm text-destructive">
			{form.formError}
		</p>
	{/if}

	<form
		method="POST"
		action="?/update"
		use:enhance={() => {
			// BEFORE submit
			pending = true;

			// 1. Destructure 'result' and 'update' from the final callback
			return async ({ result, update }) => {
				// 2. This updates the 'form' prop with the server response
				await update();

				pending = false;

				// 3. Only toast if the result was actually a success
				if (result.type === 'success') {
					toast.success('Account has been updated');
				}
				// else if (result.type === 'failure') {
				// 	toast.error('Please fix the errors below');
				// }
			};
		}}
	>
		<div class="space-y-4">
			<div class="space-y-1">
				<Label for="name">Display Name</Label>
				<Input id="name" name="name" value={data.account.name} required disabled={pending} />
				{#if form?.errors?.name}
					<p class="text-sm text-destructive">
						{form.errors.name[0]}
					</p>
				{/if}
			</div>

			<div class="space-y-1">
				<Label>Email</Label>
				<Input value={data.account.email} readonly disabled />
			</div>

			<Button disabled={pending} aria-busy={pending} type="submit" class="w-full">
				{pending ? 'Updating…' : 'Update'}
			</Button>
			<Button onclick={() => goto('/')} class="w-full" variant="ghost">Home Page</Button>
		</div>
	</form>
</div>