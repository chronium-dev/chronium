<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import RatingStars from '$lib/features/components/RatingStars.svelte';
	import ReplyView from '$lib/features/components/ReplyView.svelte';
	import { format } from 'date-fns';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { ratingItem, oneTimeCode } = $derived(data);
	let disabled = $state(false);
</script>

<div class="mx-auto max-w-2xl sm:rounded-lg sm:border">
	<section class="relative isolate m-5 overflow-hidden sm:m-10 sm:mb-2 sm:rounded-lg">
		<fieldset {disabled}>
			<div class="mx-auto max-w-2xl lg:max-w-3xl">
				{#if ratingItem.templateRelation?.logoUrl}
					<img
						src={ratingItem.templateRelation?.logoUrl}
						alt="Logo"
						class="mx-auto max-h-20 w-auto object-contain"
					/>
				{/if}

				{#if ratingItem.templateRelation?.surveyTitle}
					<Heading as="h2" class="text-center">
						{ratingItem.templateRelation?.surveyTitle}
					</Heading>
				{/if}

				<figure class="mt-3">
					<blockquote class="text-left text-sm leading-4 sm:text-sm sm:leading-6">
						<p class={'leading-10'}>Hello</p>

						<p class="whitespace-pre-wrap">
							{`Thank you for taking the time to continue the conversation with us.\nWe really value your custom and we listen to what you have to say, so we can improve every day.`}
						</p>
					</blockquote>

					<blockquote
						class="mt-3 text-left text-sm leading-4 text-gray-700 italic sm:leading-6 dark:text-gray-200"
					>
						<p class="whitespace-pre-wrap">
							{`* Below you can see your original survey rating response followed by the conversation	between us. At the foot of the page you can send us a reply message - thank you!`}
						</p>
					</blockquote>

					<hr class="mt-3 mb-0 border-t border-[#6ea527] border-x-slate-300" />
				</figure>

				<div class={'m-0 mt-2 mb-4'}>
					<div class={`rounded-lg border p-3 text-sm shadow-lg`}>
						<h3 class="text-xs">
							<span
								class="mr-2 mb-3 inline-flex items-center justify-center rounded-full bg-accent px-2 py-1 text-xs leading-none tracking-wider"
							>
								Your survey rating, submitted on{' '}
								{format(ratingItem.createdAt, 'd MMM yyyy HH:mm')}
							</span>
						</h3>

						<RatingStars ratingValue={ratingItem.starRating} />

						<div class="mt-2 space-y-6 text-sm whitespace-pre-line">
							<p>{ratingItem.comment}</p>
						</div>

						<div class={'mt-2 grid grid-cols-1 gap-0 p-0 sm:p-1'}>
							{#if ratingItem.replies}
								{#each ratingItem.replies as reply, index (index)}
									<ReplyView {reply} />
								{/each}
							{/if}
						</div>
					</div>
				</div>

				<div class={'mt-2 grid grid-cols-1 gap-0 p-1'}></div>
			</div>
		</fieldset>
	</section>
</div>
