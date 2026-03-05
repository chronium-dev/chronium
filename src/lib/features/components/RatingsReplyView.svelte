<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { markRatingReplyAsRead } from '$lib/api/ratings.remote';
	import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import RatingStateLabel from '$lib/features/components/RatingStateLabel.svelte';
	import { GENERIC_SOMETHING_WENT_WRONG_MESSAGE } from '$lib/messages/action-error';
	import type { RatingReply } from '$lib/types/ratings';
	import { RatingReplyDirection, RatingStatus } from '$lib/types/ratings';
	import { getAbbreviation } from '$lib/utils/misc';
	import { format } from 'date-fns';
	import dayjs from 'dayjs';
	import calendar from 'dayjs/plugin/calendar';
	import isYesterday from 'dayjs/plugin/isYesterday';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { toast } from 'svelte-sonner';

	dayjs.extend(relativeTime);
	dayjs.extend(isYesterday);
	dayjs.extend(calendar);

	interface Props {
		ratingReply: RatingReply;
	}

	const context = $derived(page.data.user?.context!);
	const user = $derived(page.data.user!);

	let { ratingReply }: Props = $props();

	let isPending = $state(false);

	// const fromDate = $derived(format(ratingReply.createdAt, 'd MMM yyyy HH:mm'));
	const when = $derived(
		dayjs(ratingReply.createdAt).isYesterday()
			? dayjs(dayjs(ratingReply.createdAt)).calendar()
			: dayjs(ratingReply.createdAt).fromNow()
	);

	let fromSource = $derived.by(() => {
		if (ratingReply.direction === 'out') {
			return `${getAbbreviation(ratingReply.replyUserName ?? 'unknown')}, ${when}`;
		} else {
			let source = `${when}`;
			if (!ratingReply.unread && ratingReply.readAt !== null) {
				source += `: Read by ${getAbbreviation(ratingReply.readByUserName ?? 'unknown')} on ${format(ratingReply.readAt, 'd MMM yyyy HH:mm')} `;
			}
			return source;
		}
	});

	async function handleMarkAsRead() {
		isPending = true;
		try {
			await markRatingReplyAsRead({
				id: ratingReply.id,
				userName: user.name ?? user.email ?? 'unknown name',
				userId: user.id
			});
			toast.success('Done!');
			await invalidateAll();
		} catch (error) {
			console.error('RatingsReplyView, markRatingReplyAsRead', { error });
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error(GENERIC_SOMETHING_WENT_WRONG_MESSAGE);
			}
		} finally {
			isPending = false;
		}
	}
</script>

<div
	class={ratingReply.direction === RatingReplyDirection.In.toString()
		? `w-fit max-w-[85%] border border-emerald-400 sm:w-[50%]`
		: 'ml-auto w-fit max-w-[85%] border border-purple-600 sm:w-[50%]'}
>
	<div class={ratingReply.direction === RatingReplyDirection.In.toString() ? 'mt-4' : 'mt-4'}>
		<h3 class="mb-1 ml-1 text-xs">
			<span class="">
				<span class="mr-2">
					{#if ratingReply.direction === 'out'}
						<span class="replies-sent-bubble-tip mr-2">Sent</span>
					{:else}
						<span class="replies-received-bubble-tip mr-2">Received</span>
					{/if}
					<span class="text-muted-foreground">{fromSource}</span>
				</span>
				{#if ratingReply.direction === RatingReplyDirection.In.toString() && ratingReply.unread}
					<span class="inline-flex">
						<RatingStateLabel status={RatingStatus.UnreadCustomerReply} />
					</span>
				{/if}
			</span>
		</h3>
	</div>

	<div
		class={ratingReply.direction === RatingReplyDirection.In.toString()
			? `my-0 flex w-full min-w-60 rounded-lg border border-blue-600 bg-badge-bg-replies-received px-2 text-badge-fg-replies-received shadow-lg`
			: 'my-0 ml-auto w-full rounded-lg border border-red-400 bg-badge-bg-replies-sent px-2 text-badge-fg-replies-sent shadow-lg'}
	>
		<p class="my-2 flex-1 whitespace-pre-line">{ratingReply.replyText}</p>

		{#if ratingReply.direction === RatingReplyDirection.In.toString() && ratingReply.unread}
		<div class="mt-2">
				<Button
					size="icon"
					type="button"
					variant="outline"
					disabled={isPending}
					class="ml-3"
					onclick={handleMarkAsRead}
					title="Mark as Read"
				>
					{#if isPending}
						<span><Spinner class="h4 w-4 text-blue-600" /></span>
					{:else}
						<CheckIcon class="h-4 w-4" />
					{/if}
				</Button>
			</div>
			{/if}
	</div>
</div>
