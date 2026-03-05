<script lang="ts">
	import { page } from '$app/state';
	import { signin } from '$lib/api/auth.remote';
	import { authClient } from '$lib/auth-client';
	import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
	import EyeOffIcon from '$lib/components/icons/EyeOffIcon.svelte';
	import LogoIcon from '$lib/components/LogoIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { signinSchema } from '$lib/validations/auth';

	// Capture query params
	const redirect = page.url.searchParams.get('redirect');
	const status = page.url.searchParams.get('status');

	// and handle post-verification success message
	const showVerifiedMessage = status === '1';
	const showResetPasswordMessage = status === '2';

	let showPassword = $state(false);
	let verificationEmailSent = $state(false);

	let resendVerification = $derived(
		signin.fields.allIssues()?.filter((issue) => issue.message === '403').length ?? 0 > 0
	);

	async function handleSendVerificationEmail() {
		console.log(signin.fields.email);

		await authClient.sendVerificationEmail({
			email: signin.fields.email.value()
			// callbackURL: '/' // The redirect URL after verification
		});

		signin.fields.issues;
		verificationEmailSent = true;
	}
</script>

<div class="rounded-lg bg-background p-8 shadow-lg">
	<!-- Header -->
	<div class="mb-8 text-center">
		<div class="mx-auto w-fit">
			<LogoIcon width={48} height={48} />
		</div>
		<h2 class="text-2xl font-bold">Sign In to RatingsRobot</h2>
		{#if showVerifiedMessage}
			<p class="text-md my-4 border bg-muted p-2">
				✅ Email verified successfully. You can now sign in to your account.
			</p>
		{/if}
		{#if showResetPasswordMessage}
			<p class="text-md my-4 border bg-muted p-2">
				✅ You password has been reset. You can now sign in to your account.
			</p>
		{/if}
		<p class="mt-6 text-center text-sm text-muted-foreground">
			Don't have an account?
			<a href="/register" class="font-medium text-primary hover:underline"> Sign up </a>
		</p>
	</div>

	<!-- Form-level errors -->
	{#if !verificationEmailSent}
		{#each signin.fields.allIssues() as issue}
			<div class="mb-4 rounded-md bg-destructive/10 p-2">
				{#if issue.message === '401' || issue.message === '403'}
					{#if issue.message === '401'}
						<p class="text-sm text-destructive">Invalid email address or password</p>
					{/if}
					{#if issue.message === '403' && !verificationEmailSent}
						<p class="text-sm text-destructive">
							Cannot sign-in, have you verified your email address? If not click 'Resend
							Verification Email' below.
						</p>
					{/if}
				{:else}
					<p class="text-sm text-destructive">
						{issue.message}
					</p>
				{/if}
			</div>
		{/each}
	{/if}

	{#if verificationEmailSent}
		<div class="mb-4 rounded-md bg-[#9bd01f] p-2">
			<p class="text-sm">
				A verification email has been sent to you. Please click the link in the email.
			</p>
		</div>
	{/if}

	<!-- Email / Password -->
	<form {...signin.preflight(signinSchema)} class="space-y-4">
		<div class="space-y-1">
			<Label for="email">Email address</Label>

			<Input {...signin.fields.email.as('email')} placeholder="you@example.com" />
			{#if resendVerification && !verificationEmailSent}
				<Button onclick={() => handleSendVerificationEmail()}>Resend Verification Email</Button>
			{/if}
		</div>

		<div class="space-y-1">
			<Label for="password">Password</Label>
			<div class="relative">
				<Input
					{...signin.fields.password.as('password')}
					type={showPassword ? 'text' : 'password'}
					placeholder="Enter a password"
					class="pr-10"
				/>

				<Button
					type="button"
					variant="ghost"
					size="icon"
					class="absolute top-0 right-0 h-full"
					onclick={() => (showPassword = !showPassword)}
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					aria-pressed={showPassword}
				>
					{#if showPassword}
						<EyeIcon class="h-4 w-4" />
					{:else}
						<EyeOffIcon class="h-4 w-4" />
					{/if}
				</Button>
			</div>
		</div>

		<div class="flex justify-end">
			<a href="/forget-password" class="text-sm text-primary hover:underline"> Forgot password? </a>
		</div>

		<Button
			type="submit"
			class="w-full"
			onclick={() => (verificationEmailSent = false)}
			disabled={signin.pending > 0}
		>
			{signin.pending > 0 ? 'Signing in…' : 'Sign In'}
		</Button>

		{#if redirect}
			<input type="hidden" name="redirect" value={redirect} />
		{/if}
	</form>

	<!-- Divider -->
	<!-- <div class="relative my-6">
		<div class="absolute inset-0 flex items-center">
			<div class="w-full border-t"></div>
		</div>
		<div class="relative flex justify-center text-sm">
			<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
		</div>
	</div> -->

	<!-- Social Signin (optional) -->
	<!-- 
	<div class="space-y-3">
		<Button variant="outline" class="w-full gap-3" onclick={handleGithubSignin}>
			Sign in with GitHub
		</Button>

		<Button variant="outline" class="w-full gap-3" onclick={handleGoogleSignin}>
			Sign in with Google
		</Button>
	</div>
	-->
</div>
