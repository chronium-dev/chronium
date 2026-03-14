<script lang="ts">
	import { page } from '$app/state';
	import { resetPassword } from '$lib/api/auth.remote';
	import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
	import EyeOffIcon from '$lib/components/icons/EyeOffIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { resetPasswordSchema } from '$lib/validations/auth';
	import zxcvbn from 'zxcvbn';

	// const { data } = $props();

	const token = page.url.searchParams.get('token');
	let password = $state('');
	let showPassword = $state(false);

	const MIN_LENGTH = 12;

	const isLongEnough = $derived(password.length >= MIN_LENGTH);
	const strength = $derived(password ? zxcvbn(password) : null);
	const score = $derived(strength?.score ?? 0);
</script>

<div class="rounded-lg bg-background p-8 shadow-lg">
	<div class="mb-8 text-center">
		<!-- <div class="mx-auto w-fit">
			<LogoIcon width={48} height={48} />
		</div> -->
		<h2 class="text-2xl font-bold">Reset Password</h2>
		<p class="mt-6 text-center text-sm text-muted-foreground">Please enter a new password.</p>
	</div>

	<!-- Form-level errors -->
	{#each resetPassword.fields.allIssues() as issue}
		<div class="mb-4 rounded-md bg-destructive/10 p-2">
			<p class="text-sm text-destructive">
				{issue.message}
			</p>
		</div>
	{/each}

	<form {...resetPassword.preflight(resetPasswordSchema)}>
		<div class="space-y-4">
			<div class="space-y-1">
				<Label for="password">Password</Label>
				<div class="relative">
					<Input
						{...resetPassword.fields.password.as('password')}
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

			<Button type="submit" class="w-full" disabled={resetPassword.pending > 0}>
				{resetPassword.pending > 0 ? 'Resetting…' : 'Reset'}
			</Button>

			{#if token}
				<input type="hidden" name="token" value={token} />
			{/if}
		</div>
	</form>
</div>
