<script>
	import LogoIcon from '$lib/components/LogoIcon.svelte';
</script>

<div class="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
	<!-- Header -->
	<div class="mb-8 text-center">
		<div class="mx-auto w-fit">
			<LogoIcon width={48} height={48} />
		</div>
		<h2 class="text-2xl font-bold text-red-500">Problem resetting password</h2>
		<p class="text-md mt-4 text-balance text-gray-600 dark:text-gray-400">
			Sorry, there's a problem with the email link. It may have expired - it's only valid for 1
			hour, or it may have been used already.
		</p>
		<p class="text-md mt-2 text-gray-600 dark:text-gray-400">
			Select the Signin link below, then select Forgot Password
		</p>
	</div>

	<p class="mt-6 mb-4 text-center text-sm text-muted-foreground">
		<a href="/signin" class="font-medium text-primary hover:underline"> Signin</a>
	</p>
</div>
