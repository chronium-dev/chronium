<script lang="ts">
	import { getRatingLabelFromStatus, RatingStatus } from '$lib/types/ratings';
	import clsx from 'clsx';

	let { status, size = 'small' } = $props<{
		status: RatingStatus | undefined;
		size?: 'small' | 'medium' | 'large';
	}>();

	// Mapping the Drizzle-style string values to UI labels and Tailwind classes
	const STATUS_CONFIG = {
		[RatingStatus.UnreadRating]: {
			// label: 'Unread Rating',
			label: getRatingLabelFromStatus(RatingStatus.UnreadRating),
			theme: 'bg-badge-bg-unread-rating text-badge-fg-unread-rating'
		},
		[RatingStatus.UnreadCustomerReply]: {
			label: getRatingLabelFromStatus(RatingStatus.UnreadCustomerReply),
			theme: 'bg-badge-bg-unread-customer-reply text-badge-fg-unread-customer-reply'
		},
		[RatingStatus.UnreadRatingAndCustomerReply]: {
			label: getRatingLabelFromStatus(RatingStatus.UnreadRatingAndCustomerReply),
			theme:
				'bg-badge-bg-unread-rating-and-customer-reply text-badge-fg-unread-rating-and-customer-reply'
		},
		[RatingStatus.PendingAction]: {
			label: getRatingLabelFromStatus(RatingStatus.PendingAction),
			theme: 'bg-badge-bg-pending-action text-badge-fg-pending-action'
		},
		[RatingStatus.AwaitingCustomerReply]: {
			label: getRatingLabelFromStatus(RatingStatus.AwaitingCustomerReply),
			theme: 'bg-badge-bg-awaiting-customer-reply text-badge-fg-awaiting-customer-reply'
		},
		[RatingStatus.Closed]: {
			label: getRatingLabelFromStatus(RatingStatus.Closed),
			theme: 'bg-badge-bg-closed text-badge-fg-closed'
		}
	} as const;

	const sizeClasses = $derived(
		clsx(
			'bubble-text p-3',
			size === 'small' && 'text-xs',
			size === 'medium' && 'text-sm py-1 px-2',
			size === 'large' && 'text-base py-1 px-2'
		)
	);

	// Look up config based on the incoming status string
	// const currentConfig = $derived(status ? STATUS_CONFIG[status] : null);
	const currentConfig = $derived(status ? (STATUS_CONFIG as any)[status] : null);
</script>

{#if !currentConfig}
	<p class={clsx(sizeClasses, 'bg-red-600 text-white')}>Error!</p>
{:else}
	<div>
		<p class={clsx(sizeClasses, currentConfig.theme)}>
			{currentConfig.label}
		</p>
	</div>
{/if}
