<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { RatingReplyDirection } from '$lib/types/ratings';
	import { ratingReplyInputSchema } from '$lib/validations/ratings';
	import { toast } from 'svelte-sonner';
	import z from 'zod';
	import type { RatingRow } from '../../../routes/(private)/inbox/+page.server';

	interface Props {
		ratingItem: RatingRow;
	}

	let { ratingItem } = $props();

	const form = $derived(page.form);
	const data = $derived(page.data);
	const context = $derived(page.data.user?.context!);
	const user = $derived(page.data.user!);

	let animateSaveButton = $state(false);

	let pending = $state(false);

	const maxReplyLength = 1000;

	//let fieldErrors = {};
	// 1. Create a local state for errors
	// We initialize it with server errors if they exist
	let fieldErrors = $state<Record<string, string[] | undefined>>({});
	//let fieldErrors = {};

	// 2. Sync server errors when the server responds
	$effect(() => {
		if (form?.fieldErrors) {
			fieldErrors = form.fieldErrors;
		}
	});
</script>

<div class="">
	<form
		method="POST"
		action="?/saveRatingReply"
		use:enhance={({ formData, cancel }) => {
			// BEFORE submit
			formData.append('ratingId', ratingItem.id);
			formData.append('createdByUserId', user.id);
			formData.append('replyUserName', user.name);
			formData.append('direction', RatingReplyDirection.Out);
			formData.append('email', ratingItem.email);
			// debugger;

			const data = Object.fromEntries(formData);
			const validated = ratingReplyInputSchema.safeParse(data);
			if (!validated.success) {
				console.log('validation failed:', z.flattenError(validated.error).fieldErrors);
				cancel();
				fieldErrors = z.flattenError(validated.error).fieldErrors;
				return;
			}

			// fieldErrors = {};

			pending = true;

			// 1. Destructure 'result' and 'update' from the final callback
			return async ({ result, update }) => {
				// 2. This updates the 'form' prop with the server response
				await update();

				pending = false;

				// 3. Only toast if the result was actually a success
				if (result.type === 'success') {
					toast.success('Reply has been sent');
				}
				// else if (result.type === 'failure') {
				// 	toast.error('Please fix the errors below');
				// }
			};
		}}
	>
		{#if form?.message}
			<div class="mt-4 rounded-md bg-destructive/20 p-2">
				<p class="text-sm">
					{form.message}
				</p>
			</div>
		{/if}

		{#if fieldErrors?.replyText}
			<div class="mt-4 rounded-md bg-destructive/20 p-2">
				<p class="text-sm">
					{fieldErrors?.replyText[0]}
				</p>
			</div>
		{/if}

		<div class="flex flex-col md:flex-row">
			<Textarea
				id="replyText"
				name="replyText"
				placeholder="Compose a reply to the customer or choose a common reply..."
				disabled={pending}
				maxlength={maxReplyLength}
				rows={4}
				class={`mt-4 block basis-10/12 resize-y rounded-lg bg-reply-textarea text-sm shadow-lg`}
			/>

			<div class={'my-3 flex flex-col gap-y-1 whitespace-nowrap sm:mx-3 sm:mt-4'}>
				<Button
					type="submit"
					disabled={pending}
					variant="outline"
					aria-busy={pending}
					class={`transition duration-1000 ${animateSaveButton ? 'animate-flashPulse' : ''}`}
				>
					{pending ? 'Sending reply…' : 'Send reply'}
				</Button>
			</div>
		</div>
	</form>
</div>
