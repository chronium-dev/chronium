<script lang="ts">
	import { RatingReplyDirection, type RatingReply } from '$lib/types/ratings';
	import { format } from 'date-fns';

	let { reply }: { reply: RatingReply } = $props();

	// Derived state/logic
	const fromDate = $derived(format(reply.createdAt, 'd MMM yyyy HH:mm'));
	const wasSent = $derived(reply.direction === 'out');
	const fromSource = $derived(
		wasSent
			? `Received from ${reply.replyUserName ?? 'unknown'}, ${fromDate}`
			: `Sent by you, ${fromDate}`
	);

	// Helper for dynamic classes
	const isIncoming = $derived(reply.direction === RatingReplyDirection.In.toString());
</script>

<div>
	<!-- <div
		class="my-0 w-fit min-w-60 rounded-lg p-2 shadow-lg {isIncoming
			? 'flex bg-badge-bg-replies-received text-badge-fg-replies-received'
			: 'bg-badge-bg-replies-sent text-badge-fg-replies-sent'}"
	> -->
	<div
		class={reply.direction === RatingReplyDirection.In.toString()
			? `w-fit max-w-[85%] border border-emerald-400 sm:w-[50%]`
			: 'ml-auto w-fit max-w-[85%] border border-purple-600 sm:w-[50%]'}
	>
		<h3 class="mt-2 mb-1 ml-1 text-xs text-muted-foreground">
			{fromSource}
		</h3>
		<div
			class={reply.direction === RatingReplyDirection.In.toString()
				? `my-0 flex w-full min-w-60 rounded-lg border border-blue-600 bg-badge-bg-replies-received px-2 text-badge-fg-replies-received shadow-lg`
				: 'my-0 ml-auto w-full rounded-lg border border-red-400 bg-badge-bg-replies-sent px-2 text-badge-fg-replies-sent shadow-lg'}
		>
			<p class="my-2 whitespace-pre-line">{reply.replyText}</p>
		</div>
	</div>
</div>
