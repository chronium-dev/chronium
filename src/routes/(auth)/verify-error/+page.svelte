<script lang="ts">
	export let data;

	// Determine the message to show based on the reason
	const message = (() => {
		switch (data.reason) {
			case 'token_expired':
				return {
					title: 'Verification link expired',
					body: 'For security reasons, verification links expire after a short time.'
				};
			case 'invalid_token':
				return {
					title: 'Invalid verification link',
					body: 'This verification link is no longer valid.'
				};
			case 'user_not_found':
				return {
					title: 'The user no longer exists',
					body: 'The user for this verification link no longer exists.'
				};
			default:
				return {
					title: 'Verification failed',
					body: 'We couldn’t verify your email with this link.'
				};
		}
	})();
</script>

<div class="rounded-lg bg-background p-8 shadow-lg">
	<!-- Header -->
	<div class="mb-8 text-center">
		<!-- <div class="mx-auto w-fit">
			<LogoIcon width={48} height={48} />
		</div> -->
		<h2 class="text-2xl font-bold">{message.title}</h2>
	</div>

	<p class="mb-6 text-center text-sm">
		{message.body}
	</p>

	{#if data.reason != 'user_not_found'}
		<div>
			<div class="mb-6 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
				If you still need to verify your email, sign in and we’ll send you a new verification link.
			</div>
			<a
				href="/signin"
				class="block w-full rounded-md bg-primary px-4 py-2 text-center text-sm text-primary-foreground"
			>
				Sign in to resend verification
			</a>
		</div>
	{:else}
		<div>
			<div class="mb-6 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
				You will need to register your email again, click the Register link below.
			</div>
			<a
				href="/register"
				class="block w-full rounded-md bg-primary px-4 py-2 text-center text-sm text-primary-foreground"
			>
				Register
			</a>
		</div>
	{/if}
</div>
