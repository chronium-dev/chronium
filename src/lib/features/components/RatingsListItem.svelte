<script lang="ts">
	// import { Accordion } from '$lib/components/ui/accordion';
	import { page } from '$app/state';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import RatingsListItemActions from '$lib/features/components/RatingsListItemActions.svelte';
	import RatingsListSummaryCounts from '$lib/features/components/RatingsListSummaryCounts.svelte';
	import RatingsReplyForm from '$lib/features/components/RatingsReplyForm.svelte';
	import RatingsReplyView from '$lib/features/components/RatingsReplyView.svelte';
	import RatingStars from '$lib/features/components/RatingStars.svelte';
	import RatingStates from '$lib/features/components/RatingStates.svelte';
	import { RatingReplyDirection, type RatingReply } from '$lib/types/ratings';
	import { format } from 'date-fns';
	import dayjs from 'dayjs';
	import calendar from 'dayjs/plugin/calendar';
	import isYesterday from 'dayjs/plugin/isYesterday';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import type { RatingRow } from '../../../routes/(private)/inbox/+page.server';

	const context = $derived(page.data.user?.context);
	// svelte-ignore state_referenced_locally
	console.log('context:', context);

	type Props = {
		rating: RatingRow;
	};

	const { rating }: Props = $props();

	dayjs.extend(relativeTime);
	dayjs.extend(isYesterday);
	dayjs.extend(calendar);

	const when = $derived(
		dayjs(new Date(rating.touchedAt)).isYesterday()
			? dayjs(dayjs(new Date(rating.touchedAt))).calendar()
			: dayjs(new Date(rating.touchedAt)).fromNow()
	);

	//const unreadCount = 1;
	const unreadCount = $derived(
		rating.replies
			? rating.replies.filter(
					(reply: RatingReply) =>
						reply.direction === RatingReplyDirection.In.toString() && reply.unread
				)?.length
			: 0
	);
	//const inboundCount = 2;
	const inboundCount = $derived(
		rating.replies
			? rating.replies.filter(
					(reply: RatingReply) => reply.direction === RatingReplyDirection.In.toString()
				)?.length
			: 0
	);
	//const outboundCount = 3;
	const outboundCount = $derived(
		rating.replies
			? rating.replies.filter(
					(reply: RatingReply) => reply.direction === RatingReplyDirection.Out.toString()
				)?.length
			: 0
	);
</script>

<div class="pb-3">
	<div class={'flex flex-row'}>
		<div class="w-full rounded-lg border">
			<Accordion.Root type={'single'}>
				<Accordion.Item value="item-1" class={'border-b-0'}>
					<Accordion.Trigger
						class="cursor-pointer space-x-2 rounded-lg bg-badge-bg-accordion-trigger p-2 font-normal hover:no-underline"
					>
						<div class={'m-0 flex w-full flex-col lg:flex-row lg:space-x-4'}>
							<div class={'flex flex-row space-x-2'}>
								<div class={'w-36 text-left whitespace-nowrap'}>
									<div class={'flex flex-col'}>
										<RatingStates status={rating.status} />
										<p class={'mt-1 text-xs text-muted-foreground'}>{when}</p>
									</div>
								</div>
								<div class={'mt-0.5 align-top'}>
									<RatingStars ratingValue={rating.starRating} />
								</div>
							</div>

							<p class={'mt-2 basis-8/12 text-left whitespace-pre-line lg:mt-0'}>
								{rating.comment}
							</p>

							<div class={'mt-2 flex flex-nowrap space-x-1 lg:mt-0'}>
								<RatingsListSummaryCounts
									{unreadCount}
									{inboundCount}
									{outboundCount}
									hasEmail={!!rating.email}
								/>
							</div>
						</div>
					</Accordion.Trigger>

					<Accordion.Content
						class="rounded-b-lg border border-x-0 border-b-0 bg-badge-bg-accordion-open px-2"
					>
						<div class="my-3 flex">
							<dl>
								{#if rating.email}
									<div class="my-0 grid grid-cols-3 gap-4 p-0">
										<dt class="text-xs font-medium text-muted-foreground">Email</dt>
										<dd class="col-span-2 mt-0 text-xs text-muted-foreground">{rating.email}</dd>
									</div>
								{/if}

								<div class="my-0 grid grid-cols-3 gap-4 p-0">
									<dt class="text-xs font-medium text-muted-foreground">Submitted</dt>
									<dd class="col-span-2 mt-0 text-xs text-muted-foreground">
										{format(new Date(rating.createdAt), 'd MMM yyyy HH:mm')}
									</dd>
								</div>

								{#if (context?.workspaceCount ?? 0) > 1}
									<div class="grid grid-cols-3 gap-4 p-0">
										<dt class="text-xs font-medium text-muted-foreground">Workspace</dt>
										<dd class="col-span-2 mt-0 text-xs text-muted-foreground">
											{rating.workspaceName}
										</dd>
									</div>
								{/if}

								{#if (context?.templateCount ?? 0) > 1}
									<div class="grid grid-cols-3 gap-4 p-0">
										<dt class="text-xs font-medium text-muted-foreground">Template</dt>
										<dd class="col-span-2 mt-0 text-xs text-muted-foreground">
											{rating.templateName}
										</dd>
									</div>
								{/if}

								{#if !rating.unread && rating.readByUserName && rating.readAt}
									<div class="grid grid-cols-3 gap-4 p-0">
										<dt class="text-xs font-medium text-muted-foreground">Read by</dt>
										<dd class="col-span-2 mt-0 text-xs text-muted-foreground">
											{rating.readByUserName}, {format(rating.readAt, 'd MMM yyyy HH:mm')}
										</dd>
									</div>
								{/if}

								{#if rating.closedByUserName && rating.closedAt}
									<div class="grid grid-cols-3 gap-4 p-0">
										<dt class="text-xs font-medium text-muted-foreground">Closed by</dt>
										<dd class="col-span-2 mt-0 text-xs text-muted-foreground">
											{rating.closedByUserName}, {format(rating.closedAt, 'd MMM yyyy HH:mm')}
										</dd>
									</div>
								{/if}

								<div class="grid grid-cols-3 gap-4 p-0">
									<dt class="text-xs font-medium text-muted-foreground">Rating Id</dt>
									<dd class="col-span-2 mt-0 text-xs text-muted-foreground">{rating.id}</dd>
								</div>
							</dl>
						</div>

						<div class="">
							<RatingsListItemActions ratingItem={rating} />
						</div>

						{#if rating.email}
							<div class="grid grid-cols-1 gap-0">
								{#if rating.replies}
									{#each rating.replies as reply, index (index)}
										<RatingsReplyView ratingReply={reply} />
									{/each}
								{/if}

								<div>
									<RatingsReplyForm ratingItem={rating} />
								</div>
							</div>
						{/if}
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</div>
	</div>
</div>
