<script lang="ts">
	import MailIcon from '$lib/components/icons/MailIcon.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	// import Icons from '$lib/components/icons'; // adjust path as needed

	interface Props {
		unreadCount: number;
		outboundCount: number;
		inboundCount: number;
		hasEmail: boolean;
	}

	let { unreadCount, outboundCount, inboundCount, hasEmail }: Props = $props();
</script>

<div class="flex flex-nowrap items-start space-x-2">
	<Tooltip.Provider>
		{#if unreadCount > 0}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<div class="unread-customer-replies-bubble">
						<span>{unreadCount}</span>
					</div>
				</Tooltip.Trigger>
				<Tooltip.Content class="unread-customer-replies-bubble-tip">
					<p>{unreadCount} Unread Customer Repl{unreadCount > 1 ? 'ies' : 'y'}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}

		{#if outboundCount > 0}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<div class="replies-sent-bubble mt-0.5">
						<span>{outboundCount}</span>
					</div>
				</Tooltip.Trigger>
				<Tooltip.Content class="replies-sent-bubble-tip">
					<p>{outboundCount} Repl{outboundCount > 1 ? 'ies' : 'y'} Sent to Customer</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}

		{#if inboundCount > 0}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<div class="replies-received-bubble">
						<span>{inboundCount}</span>
					</div>
				</Tooltip.Trigger>
				<Tooltip.Content class="replies-received-bubble-tip">
					<p>{inboundCount} Repl{inboundCount > 1 ? 'ies' : 'y'} Received from Customer</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}

		{#if hasEmail}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<MailIcon class="inline size-4 text-blue-400 -mt-1" />
				</Tooltip.Trigger>
				<Tooltip.Content class="email-bubble-tip">
					<p>Email Provided by Customer</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}
	</Tooltip.Provider>
</div>
