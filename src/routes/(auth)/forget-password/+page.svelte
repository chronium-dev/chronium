<script lang="ts">
	import { forgotPassword } from '$lib/api/auth.remote';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { forgetPasswordSchema } from '$lib/validations/auth';
</script>

<div class="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
	<!-- Header -->
	<div class="mb-8 text-center">
		<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
		{#if !forgotPassword.result?.success}
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Enter your email to receive a password reset link
			</p>
		{/if}
	</div>

	{#if forgotPassword.result?.success}
		<div class="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
			<p class="text-sm text-green-800 dark:text-green-200">
				If this email address exists in our system, we've sent a reset password email. Check your
				email for the password reset link!
			</p>
		</div>
	{:else}
		<!-- Form-level errors -->
		{#each forgotPassword.fields.allIssues() as issue}
			<div class="mb-4 rounded-md bg-destructive/10 p-2">
				<p class="text-sm text-destructive">
					{issue.message}
				</p>
			</div>
		{/each}

		<!-- Reset Form -->
		<form {...forgotPassword.preflight(forgetPasswordSchema)} class="space-y-4">
			<div class="space-y-2">
				<Label for="email">Email address</Label>
				<Input {...forgotPassword.fields.email.as('email')} placeholder="you@example.com" />
			</div>

			<Button type="submit" disabled={forgotPassword.pending > 0} class="w-full">
				{forgotPassword.pending > 0 ? 'Sending...' : 'Send Reset Link'}
			</Button>
		</form>
	{/if}

	<!-- Back to Signin -->
	<p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
		<a href="/signin" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
			Back to signin page
		</a>
	</p>
</div>
