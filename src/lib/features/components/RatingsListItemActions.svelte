<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		markRatingAsClosed,
		markRatingAsRead,
		markRatingAsUnread,
		resetRatingStatus
	} from '$lib/api/ratings.remote';
	import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import ResetIcon from '$lib/components/icons/ResetIcon.svelte';
	import UnreadIcon from '$lib/components/icons/UnreadIcon.svelte';
	import XIcon from '$lib/components/icons/XIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { GENERIC_SOMETHING_WENT_WRONG_MESSAGE } from '$lib/messages/action-error';
	import { getRatingLabelFromStatus, RatingStatus } from '$lib/types/ratings';
	import { format } from 'date-fns';
	import dayjs from 'dayjs';
	import { toast } from 'svelte-sonner';
	import type { RatingRow } from '../../../routes/(private)/inbox/+page.server';

	interface Props {
		ratingItem: RatingRow;
	}

	let { ratingItem }: Props = $props();

	const context = $derived(page.data.user?.context!);
	const user = $derived(page.data.user!);

	let isMarkUnreadPending = $state(false);
	let isMarkReadPending = $state(false);
	let isClosePending = $state(false);
	let isResetPending = $state(false);

	// ---------------------------------------------------------------------------
	// Helpers
	// ---------------------------------------------------------------------------

	/** Resolve a user-display name with a fallback. */
	function displayName(): string {
		return user.name ?? user.email ?? 'unknown name';
	}

	/** Generic wrapper: sets a pending flag, awaits a promise, then clears it. */
	async function withPending(setPending: (v: boolean) => void, promise: Promise<unknown>) {
		setPending(true);
		try {
			await promise;
			toast.success('Done!');
			// SvelteKit equivalent of router.refresh() — invalidates all loads
			await goto(window.location.pathname, { invalidateAll: true });
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : GENERIC_SOMETHING_WENT_WRONG_MESSAGE);
		} finally {
			setPending(false);
		}
	}

	// ---------------------------------------------------------------------------
	// Action handlers
	// ---------------------------------------------------------------------------

	async function handleMarkUnread() {
		await withPending((v) => (isMarkUnreadPending = v), markRatingAsUnread({ id: ratingItem.id }));
	}

	async function handleMarkRead() {
		await withPending(
			(v) => (isMarkReadPending = v),
			markRatingAsRead({
				id: ratingItem.id,
				userName: displayName(),
				userId: user.id
			})
		);
	}

	async function handleClose() {
		await withPending(
			(v) => (isClosePending = v),
			markRatingAsClosed({
				id: ratingItem.id,
				userName: displayName(),
				userId: user.id
			})
		);
	}

	async function handleReset() {
		await withPending(
			(v) => (isResetPending = v),
			resetRatingStatus({
				id: ratingItem.id,
				userId: user.id,
				userName: displayName()
			})
		);
	}

	const handleClipboardClip = () => {
		void navigator.clipboard.writeText(clip());
		toast.success('Copied to clipboard');
	};

	// ---------------------------------------------------------------------------
	// Derived visibility flags
	// ---------------------------------------------------------------------------

	const showMarkUnread = $derived(!ratingItem.unread && !!ratingItem.replies);
	const showMarkRead = $derived(ratingItem.unread);
	const showClose = $derived(ratingItem.status !== RatingStatus.Closed.toString());
	const showReset = $derived(ratingItem.status === RatingStatus.Closed.toString());

	$inspect('showMarkRead:', showMarkRead);

	const when = $derived(
		dayjs(new Date(ratingItem.touchedAt)).isYesterday()
			? dayjs(dayjs(new Date(ratingItem.touchedAt))).calendar()
			: dayjs(new Date(ratingItem.touchedAt)).fromNow()
	);

	const clip = () => {
		let clip = `Rating: ${ratingItem.starRating} Star${ratingItem.starRating > 1 ? 's' : ''}\n`;
		if (ratingItem.comment && ratingItem.comment.length > 0) {
			clip += `Comment: ${ratingItem.comment}\n`;
		}
		clip += `Status: ${getRatingLabelFromStatus(ratingItem.status)}\n`;
		if (ratingItem.email && ratingItem.email.length > 0) {
			clip += `Email: ${ratingItem.email}\n`;
		}
		clip += `Submitted: ${format(new Date(ratingItem.createdAt), 'd MMM yyyy HH:mm')} (${when})\n`;
		if (context.orgCount > 1) {
			clip += `Organization: ${ratingItem.workspaceName}\n`;
		}
		if (context.templateCount > 1) {
			clip += `Template: ${ratingItem.templateName}\n`;
		}
		if (!ratingItem.unread && ratingItem.readByUserName && ratingItem.readAt) {
			clip += `Read by: ${ratingItem.readByUserName}, ${format(ratingItem.readAt, 'd MMM yyyy HH:mm')}\n`;
		}
		if (ratingItem.closedByUserName && ratingItem.closedAt) {
			clip += `Closed by: ${ratingItem.closedByUserName}, ${format(ratingItem.closedAt, 'd MMM yyyy HH:mm')}\n`;
		}
		clip += `Rating Id: ${ratingItem.id}\n`;
		return clip;
	};
</script>

<div class="mt-2 flex space-x-2">
	<!-- Mark as Unread -->
	{#if showMarkUnread}
		<Button
			size="icon"
			type="button"
			variant="outline"
			disabled={isMarkUnreadPending}
			onclick={handleMarkUnread}
			title="Mark as Unread"
		>
			{#if isMarkUnreadPending}
				<span><Spinner class="h4 w-4 text-blue-600" /></span>
			{:else}
				<UnreadIcon class="h-4 w-4" />
			{/if}
		</Button>
	{/if}

	<!-- Mark as Read -->
	{#if showMarkRead}
		<Button
			size="icon"
			type="button"
			variant="outline"
			disabled={isMarkReadPending}
			onclick={handleMarkRead}
			title="Mark as Read"
		>
			{#if isMarkReadPending}
				<span><Spinner class="h4 w-4 text-blue-600" /></span>
			{:else}
				<CheckIcon class="h-4 w-4" />
			{/if}
		</Button>
	{/if}

	<!-- Close -->
	{#if showClose}
		<Button
			size="icon"
			type="button"
			variant="outline"
			disabled={isClosePending}
			title="Close"
			onclick={handleClose}
		>
			{#if isClosePending}
				<span><Spinner class="h4 w-4 text-blue-600" /></span>
			{:else}
				<XIcon class="h-4 w-4" />
			{/if}
		</Button>
	{/if}

	<!-- Reset Status -->
	{#if showReset}
		<Button
			size="icon"
			type="button"
			variant="outline"
			disabled={isResetPending}
			title="Reset Status"
			onclick={handleReset}
		>
			{#if isResetPending}
				<span><Spinner class="h4 w-4 text-blue-600" /></span>
			{:else}
				<ResetIcon class="h-4 w-4" />
			{/if}
		</Button>
	{/if}

	<!-- Copy to Clipboard -->
	<div class="ml-2 text-left">
		<Button
			size="icon"
			type="button"
			variant="outline"
			title="Copy to clipboard"
			onclick={handleClipboardClip}
		>
			<CopyIcon class="h-4 w-4" />
		</Button>
	</div>
</div>
