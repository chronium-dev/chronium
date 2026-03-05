<script>
	import LogoIcon from '$lib/components/LogoIcon.svelte';
</script>

<div class="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
	<!-- Header -->
	<div class="mb-8 text-center">
		<div class="mx-auto w-fit">
			<LogoIcon width={48} height={48} />
		</div>
		<h2 class="text-2xl font-bold">Verification Email Sent</h2>
		<p class="text-md mt-4 text-balance text-gray-600 dark:text-gray-400">
			Check your inbox! We've sent you a unique confirmation link. Please click it to verify your email address and activate your account.
		</p>
		<p class="text-md mt-2 text-gray-600 dark:text-gray-400">Thank you!</p>
	</div>

	<p class="mt-6 mb-4 text-center text-sm text-muted-foreground">
		<a href="/" class="font-medium text-primary hover:underline"> RatingsRobot Home Page</a>
	</p>
</div>
