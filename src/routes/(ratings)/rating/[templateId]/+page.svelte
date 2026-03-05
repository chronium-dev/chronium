<script lang="ts">
	import { enhance } from '$app/forms';
	import Heading from '$lib/components/Heading.svelte';
	import LogoIcon from '$lib/components/LogoIcon.svelte';
	import LogoName from '$lib/components/LogoName.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let pending = $state(false);
	let rating = $state(0);
</script>

<div class="mx-auto max-w-xl">
	<div class="rounded-lg border py-4">
		<!-- {#if form?.formError}
			<p class="mb-4 text-sm text-destructive">
				{form.formError}
			</p>
		{/if} -->

		<form
			method="POST"
			action="?/saveRating"
			use:enhance={() => {
				pending = true;
				return async ({ result, update }) => {
					await update();
					pending = false;

					if (result.type === 'success') {
						toast.success('Account has been updated');
					}
				};
			}}
		>
			<input type="hidden" name="templateId" value={data.template.id} />
			<input type="hidden" name="workspaceId" value={data.template.workspaceId} />

			<!-- SINGLE horizontal padding source -->
			<div class="space-y-4 px-5">
				{#if data.template.logoUrl}
					<img
						src={data.template.logoUrl}
						alt="Logo"
						class="mx-auto max-h-20 w-auto object-contain"
					/>
				{/if}

				{#if data.template.surveyTitle}
					<Heading as="h2" class="text-center">
						{data.template.surveyTitle}
					</Heading>
				{/if}

				<p class="text-center text-xl text-balance whitespace-pre-line">
					{data.template.surveyIntro}
				</p>

				<hr class="border-t border-[#6ea527]" />

				<p class="text-md text-center text-balance whitespace-pre-line">
					{data.template.surveyRatingQuestion}
				</p>

				{#if form?.errors?.starRating}
					<div class="mb-4 rounded-md bg-destructive/10 p-2">
						<p class="text-sm text-destructive">
							{form.errors.starRating[0]}
						</p>
					</div>
				{/if}
				<div class="flex justify-center">
					<StarRating bind:rating name="starRating" />
				</div>

				<!-- Comment -->
				<div class="space-y-1">
					<Textarea
						name="comment"
						class="w-full bg-muted"
						rows={3}
						maxlength={500}
						placeholder={data.template.surveyCommentPrompt}
					/>
				</div>

				<!-- Email -->
				<div class="space-y-1">
					<Input
						type="email"
						name="email"
						class="w-full bg-muted"
						maxlength={100}
						placeholder={data.template.surveyEmailPrompt}
					/>

					<p class="text-xs whitespace-pre-line text-muted-foreground">
						{data.template.surveyEmailDisclaimer}
					</p>
				</div>

				<hr class="border-t border-[#6ea527]" />

				<!-- Submit -->
				<div class="flex flex-col items-center space-y-6">
					<Button type="submit">Submit</Button>

					<div class="flex items-center gap-2">
						<p class="text-[8px] text-muted-foreground">Powered by</p>
						<a href="/" class="flex gap-1">
							<LogoIcon width={17} height={17} />
							<LogoName height="22" className="-mt-0.5" />
						</a>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
